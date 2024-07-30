import { app } from "electron";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import * as tar from "tar";

const Store = require("electron-store");
const store = new Store();

export function getBundledDfxPath() {
  const platform = process.platform;
  let dfxFileName;

  if (platform === "darwin") {
    dfxFileName = "dfx-0.21.0-x86_64-darwin.tar.gz";
  } else if (platform === "linux") {
    dfxFileName = "dfx-0.21.0-x86_64-linux.tar.gz";
  } else {
    throw new Error("Unsupported platform");
  }

  // Use app.getAppPath() to get the application's root directory
  const appRoot = app.getAppPath();
  return path.join(
    appRoot,
    "resources",
    `dfx-${platform === "darwin" ? "macos" : "linux"}`,
    dfxFileName
  );
}

export async function setupBundledDfx() {
  try {
    const bundledDfxPath = getBundledDfxPath();
    const extractPath = path.join(app.getPath("userData"), "dfx");

    console.log(`Bundled DFX path: ${bundledDfxPath}`);
    console.log(`Extract path: ${extractPath}`);

    if (!fs.existsSync(bundledDfxPath)) {
      throw new Error(`Bundled DFX file not found at ${bundledDfxPath}`);
    }

    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
      console.log(`Created extract directory: ${extractPath}`);
    }

    console.log("Starting tar extraction...");
    await tar.x({
      file: bundledDfxPath,
      cwd: extractPath,
    });
    console.log("Tar extraction completed successfully");

    const dfxPath = path.join(extractPath, "dfx");
    process.env.DFX_PATH = dfxPath;
    console.log(`Set DFX_PATH to: ${dfxPath}`);

    if (!fs.existsSync(dfxPath)) {
      throw new Error(
        `DFX executable not found at ${dfxPath} after extraction`
      );
    }

    // Make the dfx file executable
    fs.chmodSync(dfxPath, "755");
    console.log("Made DFX executable");

    return true;
  } catch (error) {
    console.error("Error setting up bundled DFX:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw error;
  }
}

export async function executeDfxCommand(
  command,
  subcommand?,
  args?,
  flags?,
  customPath?
) {
  const useBundledDfx = await store.get("useBundledDfx");
  const storedCustomDfxPath = await store.get("customDfxPath");

  const argStr = args || [];
  const flagStr = flags || [];
  const allArgs = [command, subcommand, ...argStr, ...flagStr].filter(Boolean);

  return new Promise((resolve, reject) => {
    const child = spawn("dfx", allArgs, { shell: true, cwd: customPath });
    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data;
    });

    child.stderr.on("data", (data) => {
      stderrData += data;
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`Command failed with exit code ${code}: ${stderrData}`)
        );
      } else {
        resolve(stdoutData.trim());
      }
    });
  });
}
