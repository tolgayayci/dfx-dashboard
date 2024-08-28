import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { app } from "electron";

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
    const argStr = args || [];
    const flagStr = flags || [];
    const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(
      Boolean
    );
    const commandStr = `${bundledDfxPath} ${allArgs.join(" ")}`;

    return new Promise((resolve, reject) => {
      const child = spawn(bundledDfxPath, allArgs, {
        cwd: workingPath,
        shell: true,
      });
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

export function getBundledDfxPath(): string {
  const isProduction = app.isPackaged;
  let basePath: string;
  let resourcePath: string;

  if (isProduction) {
    basePath = path.dirname(app.getPath("exe"));
    resourcePath = path.join(basePath, "..", "Resources");
  } else {
    basePath = app.getAppPath();
    resourcePath = path.join(basePath, "resources");
  }

  const platformFolder = process.platform === "darwin" ? "mac" : "linux";
  const dfxPath = path.join(
    resourcePath,
    platformFolder,
    "dfx-extracted",
    "dfx"
  );

  console.log("Bundled DFX Path:", dfxPath);

  return dfxPath;
}

export async function executeDfxCommandWithFallback(
  useBundledDfx: boolean,
  command: string,
  subcommand?: string,
  args?: string[],
  flags?: string[],
  workingPath?: string
): Promise<string> {
  try {
    if (useBundledDfx) {
      const bundledDfxPath = getBundledDfxPath();
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
