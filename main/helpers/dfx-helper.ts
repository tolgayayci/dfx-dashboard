import { spawn } from "child_process";
import { app } from "electron";
import * as path from "path";

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

export function getBundledDfxPath(): string {
  const isProduction = app.isPackaged;
  let basePath: string;
  let resourcePath: string;

  if (isProduction) {
    basePath = path.dirname(app.getPath("exe"));
    resourcePath = path.join(basePath, "resources");
  } else {
    basePath = app.getAppPath();
    resourcePath = path.join(basePath, "resources");
  }

  const platformFolder = process.platform === "darwin" ? "mac" : "linux";
  const dfxPath = path.join(resourcePath, "dfx-extracted", "dfx");

  console.log("Bundled DFX Path:", dfxPath);

  return dfxPath;
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
    const dfxPath = bundledDfxPath;
    const argStr = args || [];
    const flagStr = flags || [];
    const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(
      Boolean
    );
    const commandStr = `${dfxPath} ${allArgs.join(" ")}`;

    console.log("Executing bundled DFX command:", commandStr);

    return new Promise((resolve, reject) => {
      const child = spawn(dfxPath, allArgs, {
        cwd: workingPath,
        shell: true,
        env: { ...process.env, PATH: `${path.dirname(dfxPath)}:${process.env.PATH}` },
      });
      let stdoutData = "";
      let stderrData = "";

      child.stdout.on("data", (data) => {
        stdoutData += data;
        console.log("DFX stdout:", data.toString());
        if (data.includes("Dashboard:")) {
          resolve(stdoutData);
        }
      });

      child.stderr.on("data", (data) => {
        stderrData += data;
        console.error("DFX stderr:", data.toString());
      });

      child.on("error", (error) => {
        console.error("DFX spawn error:", error);
        reject(error);
      });

      setTimeout(() => {
        resolve(stdoutData);
      }, 10000);

      child.on("close", (code) => {
        console.log(`DFX process exited with code ${code}`);
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
