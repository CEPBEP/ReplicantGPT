import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import querystring from 'querystring';

// Function to list files in a directory
export async function listFiles(directoryPath) {
    try {
        const items = await fs.readdir(directoryPath);
        const fileDetails = [];
        for (const item of items) {
            const itemPath = path.join(directoryPath, item);
            const stats = await fs.stat(itemPath);
            if (stats.isFile()) {
                fileDetails.push({
                    path: itemPath,
                    ctime: stats.ctime.toISOString(),
                    mtime: stats.mtime.toISOString(),
                    size: stats.size
                });
            }
        }
        return fileDetails;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function runProjectCmd(cmd, options) {

    const env = {
        FOO: `this is a very 'log' "string"` // process.env.EXISTING_VAR
    };

    const envString = Object.entries(env).map(([key, value]) => `-e ${key}=${querystring.escape(value)}`).join(' ');

    // docker run -ti -v $(pwd)/project:/project devy /bin/bash
    project_dir = path.join(__dirname, 'project');
    const dockerCmd = `docker run -ti ${envString} ${project_dir}:/project devy /bin/bash -c "${cmd}"`;
}

export async function runCommand(cmd, options) {
    return new Promise((resolve, reject) => {
        exec(cmd, options, (error, cmdStdout, cmdStderr) => {
            if (error) {
                if (error.killed && error.signal === 'SIGTERM') {
                    // Command execution timed out
                    reject({
                        status: 408,
                        message: 'Command execution timed out',
                        stdout: cmdStdout,
                        stderr: cmdStderr,
                    });
                } else {
                    // Other error
                    reject({
                        status: 500,
                        message: error.message,
                        stdout: cmdStdout,
                        stderr: cmdStderr,
                    });
                }
            }

            resolve({
                exit_code: error ? error.code : 0,
                stdout: cmdStdout,
                stderr: cmdStderr,
            });
        });
    });
}
