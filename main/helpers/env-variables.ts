const fs = require("fs");
const os = require("os");
const path = require("path");

// Function to get the home directory based on the OS
export const getHomeDirectory = () => {
  return os.homedir();
};

// Function to get common profile file paths
export const getProfileFilePaths = () => {
  const homeDir = os.homedir();
  switch (os.platform()) {
    case "win32":
      // Windows paths (if applicable)
      return []; // Windows often doesn't use profile files in the same way
    case "linux":
    case "darwin": // macOS
      return [
        path.join(homeDir, ".bashrc"),
        path.join(homeDir, ".bash_profile"),
        path.join(homeDir, ".zshrc"),
        path.join(homeDir, ".profile"),
      ];
    default:
      return [];
  }
};

// Function to update user's profile with new environment variables
export const updateProfileWithEnvVars = (filePath, key, newValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    let updated = false;

    // Modify the specific line containing the environment variable, if it exists
    const updatedLines = lines.map((line) => {
      if (line.startsWith(`export ${key}=`)) {
        updated = true;
        return `export ${key}='${newValue}'`;
      }
      return line;
    });

    // Append the new variable if it wasn't found
    if (!updated) {
      updatedLines.push(`export ${key}='${newValue}'`);
    }

    // Join the lines back into a single string and write to the file
    fs.writeFileSync(filePath, updatedLines.join("\n"), "utf8");
  } else {
    console.error(`File not found: ${filePath}`);
  }
};

export const readEnvVarsFromProfiles = () => {
  const envVars = {};
  const filePaths = getProfileFilePaths();

  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line) => {
        if (line.startsWith("export ")) {
          const [key, value] = line.substring(7).split("=");
          if (key && value) {
            // Storing both value and path
            envVars[key] = {
              value: value.replace(/'/g, "").replace(/"/g, ""), // Remove quotes
              path: filePath,
            };
          }
        }
      });
    }
  });

  return envVars;
};
