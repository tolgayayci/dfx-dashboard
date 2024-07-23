import { spawn } from "child_process";

export function executeDfxCommand(
  command: string,
  subcommand?: string,
  args?: string[],
  flags?: string[],
  path?: string
): Promise<string> {
  const argStr = args || [];
  const flagStr = flags || [];
  const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(Boolean);

  const commandStr = `dfx ${allArgs.join(" ")}`;

  return new Promise((resolve, reject) => {
    const child = spawn("dfx", allArgs, { cwd: path, shell: true });

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
        // If the command failed, reject with the error output
        reject(
          new Error(
            `Command "${commandStr}" failed with exit code ${code}: ${stderrData}`
          )
        );
      } else {
        // If the command succeeded, resolve with both stdout and stderr outputs
        const combinedOutput = stdoutData + stderrData;
        resolve(combinedOutput.trim()); // Trim to remove any extra whitespace
      }
    });
  });
}
