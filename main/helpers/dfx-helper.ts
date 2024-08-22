import { spawn } from "child_process";
import { createReadStream, promises as fs } from "fs";
import { extract } from "tar";
import path from "path";
import os from "os";

let extractedDfxPath: string | null = null;

export function executeDfxCommand(
  command: string,
  subcommand?: string,
  args?: string[],
  flags?: string[],
  workingPath?: string
): Promise<string> {
  const argStr = args || [];
  const flagStr = flags || [];
  const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(Boolean);
  const commandStr = `dfx ${allArgs.join(" ")}`;

  return new Promise((resolve, reject) => {
    const child = spawn("dfx", allArgs, { cwd: workingPath, shell: true });
    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data;
      if (data.includes("Dashboard:")) {
        resolve(stdoutData);
      }
    });

    child.stderr.on("data", (data) => {
      stderrData += data;
    });

    child.on("error", (error) => {
      reject(error);
    });

    setTimeout(() => {
      resolve(stdoutData);
    }, 10000);

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Command "${commandStr}" failed with exit code ${code}: ${stderrData}`
          )
        );
      } else {
        const combinedOutput = stdoutData + stderrData;
        resolve(combinedOutput.trim());
      }
    });
  });
}

export async function executeBundledDfxCommand(
  bundledDfxPath: string,
  command: string,
  subcommand?: string,
  args?: string[],
  flags?: string[],
  workingPath?: string
): Promise<string> {
  try {
    const dfxPath = await getOrExtractDfxPath(bundledDfxPath);
    const argStr = args || [];
    const flagStr = flags || [];
    const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(
      Boolean
    );
    const commandStr = `${dfxPath} ${allArgs.join(" ")}`;

    return new Promise((resolve, reject) => {
      const child = spawn(dfxPath, allArgs, { cwd: workingPath, shell: true });
      let stdoutData = "";
      let stderrData = "";

      child.stdout.on("data", (data) => {
        stdoutData += data;
        if (data.includes("Dashboard:")) {
          resolve(stdoutData);
        }
      });

      child.stderr.on("data", (data) => {
        stderrData += data;
      });

      child.on("error", (error) => {
        reject(error);
      });

      setTimeout(() => {
        resolve(stdoutData);
      }, 10000);

      child.on("close", (code) => {
        if (code !== 0) {
          reject(
            new Error(
              `Command "${commandStr}" failed with exit code ${code}: ${stderrData}`
            )
          );
        } else {
          const combinedOutput = stdoutData + stderrData;
          resolve(combinedOutput.trim());
        }
      });
    });
  } catch (error) {
    console.error("Error executing bundled DFX command:", error);
    throw error;
  }
}

async function getOrExtractDfxPath(bundledDfxPath: string): Promise<string> {
  if (extractedDfxPath) {
    return extractedDfxPath;
  }

  const tempDir = path.join(os.tmpdir(), "dfx-extracted");

  try {
    // Ensure the directory exists
    await fs.mkdir(tempDir, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      createReadStream(bundledDfxPath)
        .pipe(extract({ cwd: tempDir }))
        .on("finish", () => {
          extractedDfxPath = path.join(tempDir, "dfx");
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    // Verify the extracted file exists and is executable
    await fs.access(extractedDfxPath!, fs.constants.X_OK);

    return extractedDfxPath!;
  } catch (error) {
    console.error("Error extracting or accessing DFX:", error);
    throw new Error(
      `Failed to extract or access bundled DFX: ${error.message}`
    );
  }
}

export function clearExtractedDfxPath() {
  extractedDfxPath = null;
}

export async function isDfxInstalled(): Promise<boolean> {
  try {
    const result = await executeDfxCommand("--version");
    return result.trim().startsWith("dfx");
  } catch (error) {
    console.error("Error checking DFX installation:", error);
    return false;
  }
}

export async function getDfxVersions(
  bundledDfxPath: string
): Promise<{ system: string; bundled: string }> {
  let systemVersion = "Not installed";
  let bundledVersion = "Not available";

  try {
    systemVersion = await executeDfxCommand("--version");
  } catch (error) {
    console.error("Error getting system DFX version:", error);
  }

  try {
    bundledVersion = await executeBundledDfxCommand(
      bundledDfxPath,
      "--version"
    );
  } catch (error) {
    console.error("Error getting bundled DFX version:", error);
  }

  return {
    system: systemVersion,
    bundled: bundledVersion,
  };
}

export async function executeDfxCommandWithFallback(
  bundledDfxPath: string,
  useBundledDfx: boolean,
  command: string,
  subcommand?: string,
  args?: string[],
  flags?: string[],
  workingPath?: string
): Promise<string> {
  try {
    if (useBundledDfx) {
      return await executeBundledDfxCommand(
        bundledDfxPath,
        command,
        subcommand,
        args,
        flags,
        workingPath
      );
    } else {
      return await executeDfxCommand(
        command,
        subcommand,
        args,
        flags,
        workingPath
      );
    }
  } catch (error) {
    console.error(
      `Error executing ${useBundledDfx ? "bundled" : "system"} DFX command:`,
      error
    );

    if (useBundledDfx) {
      console.log("Falling back to system DFX...");
      try {
        return await executeDfxCommand(
          command,
          subcommand,
          args,
          flags,
          workingPath
        );
      } catch (fallbackError) {
        console.error("Error with fallback to system DFX:", fallbackError);
        throw new Error(
          "Failed to execute DFX command with both bundled and system DFX"
        );
      }
    } else {
      throw error;
    }
  }
}
