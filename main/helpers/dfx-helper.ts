import { exec } from 'child_process';

export function executeDfxCommand(
    command: string,
    subcommand: string,
    args?: string[],
    flags?: string[],
    path?: string
): Promise<string> {
    const argStr = args?.join(' ') || '';
    const flagStr = flags?.map(flag => `--${flag}`).join(' ') || '';
    const fullCommand = `dfx ${command} ${subcommand} ${argStr} ${flagStr}`.trim();

    console.log(`Executing: ${fullCommand} in ${path || 'current directory'}`);
    
    return new Promise((resolve, reject) => {
        exec(fullCommand, { cwd: path }, (error, stdout, stderr) => {
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
