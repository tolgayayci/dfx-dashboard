import { spawn } from "child_process";

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
    const dfxPath = bundledDfxPath;
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
