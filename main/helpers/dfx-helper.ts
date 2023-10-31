import { spawn } from 'child_process';

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
    
    console.log(`Executing: dfx ${allArgs.join(' ')} in ${path || 'current directory'}`);

    return new Promise((resolve, reject) => {
        const child = spawn('dfx', allArgs, { cwd: path });

        let stdoutData = '';
        let stderrData = '';

        child.stdout.on('data', (data) => {
            stdoutData += data;
        });

        child.stderr.on('data', (data) => {
            stderrData += data;
        });

        child.on('error', (error) => {
            console.error('Error:', error);
            reject(error);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error('DFX Error:', stderrData);
                reject(new Error(stderrData));
            } else {
                resolve(stdoutData);
            }
        });
    });
}
