import { NextApiRequest, NextApiResponse } from "next";
import { exec } from 'child_process';

export function executeDfxCommand(command: string, path?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`dfx ${command}`,{cwd: path}, (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
                return;
            }
            if (stderr) {
                console.error('DFX Error:', stderr);
                reject(new Error(stderr));
                return;
            }
            resolve(stdout);
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { subcommand } = req.query;
  const { options } = req.query

  const command = "identity"

  switch (method) {
    case "GET":
      switch (subcommand) {
        case "get-principal":
          // Implement logic for "dfx identity get-principal" command
          res.status(200).json({ message: "Implement get-principal logic" });
          break;
        case "get-wallet":
          // Implement logic for "dfx identity get-wallet" command
          res.status(200).json({ message: "Implement get-wallet logic" });
          break;
        case "list":
          // Implement logic for "dfx identity whoami" command
          executeDfxCommand(command + "  " + "list")
          .then((identity) => {
            res.status(200).json({ message: { identity } });
          })
            .catch((error) => {
                console.error("Error executing dfx command:", error);
                res.status(500).json({ message: "Internal server error" });
            });
          break
        case "whoami":
          // Implement logic for "dfx identity whoami" command
          executeDfxCommand(command + "  " + "whoami")
          .then((result) => {
            res.status(200).json({ result });
          })
          .catch((error) => {
            console.error("Error executing dfx command:", error);
            res.status(500).json({ message: "Internal server error" });
          });
          break
        default:
          res.status(404).json({ message: "Command not found" });
      }
      break;
    case "POST":
      switch (subcommand) {
        case "new":
          // Implement logic for "dfx identity new" command
          res.status(201).json({ message: "Implement new identity logic" });
          break;
        case "import":
          // Implement logic for "dfx identity import" command
          res.status(201).json({ message: "Implement import identity logic" });
          break;
        case "remove":
          // Implement logic for "dfx identity remove" command
          res.status(204).end();
          break;
        case "rename":
          // Implement logic for "dfx identity rename" command
          res.status(200).json({ message: "Implement rename identity logic" });
          break;
        case "set-wallet":
          // Implement logic for "dfx identity set-wallet" command
          res.status(200).json({ message: "Implement set-wallet logic" });
          break;
        case "deploy-wallet":
          // Implement logic for "dfx identity set-wallet" command
          res.status(200).json({ message: "Implement set-wallet logic" });
          break;
        case "use":
          // Implement logic for "dfx identity use" command
          res.status(200).json({ message: "Implement use identity logic" });
          break;
        default:
          res.status(404).json({ message: "Command not found" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}