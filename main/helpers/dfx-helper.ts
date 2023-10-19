import { exec } from 'child_process';

export function executeDfxCommand(command: string, path?: string): Promise<string> {
    console.log(`Executing dfx ${command} in ${path}`)
    return new Promise((resolve, reject) => {
        exec(`dfx ${command}`,{cwd: path}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout);
        });
    });
}