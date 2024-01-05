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
  console.log(`Executing: ${commandStr} in ${path || "current directory"}`);

  return new Promise((resolve, reject) => {
    const child = spawn("dfx", allArgs, { cwd: path });

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      stdoutData += data;
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      stderrData += data;
    });

    child.on("error", (error) => {
      console.error("Child process error:", error);
      reject(error);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
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
