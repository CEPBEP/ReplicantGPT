import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import run from './agent/runner.js';

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
          size: stats.size,
        });
      }
    }
    return fileDetails;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const escaper = (str) => str.replace(/"/g, '\\"');

export async function runProjectCmd(meta, options) {

  const envString = Object.entries(env)
    .map(([key, value]) => `-e ${key}="${escaper(value)}"`)
    .join(" ");

    const envString = Object.entries(env).map(([key, value]) => `-e ${key}="${escaper(value)}"`).join(' ');

    const project_dir = path.join(process.cwd(), 'project');

    const rv = await run({ model: meta.MODEL, prompt: meta.PROMPT, projectDir: project_dir });
    console.log(rv);
    return rv;
}


export async function runCommand(cmd, options) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, cmdStdout, cmdStderr) => {
      if (error) {
        if (error.killed && error.signal === "SIGTERM") {
          // Command execution timed out
          reject({
            status: 408,
            message: "Command execution timed out",
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
