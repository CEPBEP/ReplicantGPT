import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import run from "./agent/runner.js";

const project_dir = path.join(process.cwd(), "project");

// Recursive function to list files in a directory
export async function listFiles(currentPath = project_dir) {
  try {
    const items = await fs.readdir(currentPath);
    const fileDetails = [];

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stats = await fs.stat(itemPath);

      if (stats.isFile()) {
        fileDetails.push({
          path: itemPath,
          ctime: stats.ctime.toISOString(),
          mtime: stats.mtime.toISOString(),
          size: stats.size,
        });
      } else if (stats.isDirectory()) {
        const nestedFiles = await listFiles(itemPath);
        fileDetails.push(...nestedFiles);
      }
    }

    return fileDetails;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// export async function listFiles() {
//     try {
//         const items = await fs.readdir(project_dir);
//         const fileDetails = [];
//         for (const item of items) {
//             const itemPath = path.join(project_dir, item);
//             const stats = await fs.stat(itemPath);
//             if (stats.isFile()) {
//                 fileDetails.push({
//                     path: itemPath,
//                     ctime: stats.ctime.toISOString(),
//                     mtime: stats.mtime.toISOString(),
//                     size: stats.size
//                 });
//             }
//         }
//         return fileDetails;
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

export async function getFile(filename) {
  filename = path.join(project_dir, filename);
  return await fs.readFile(filename, "utf8");
}

const escaper = (str) => str.replace(/"/g, '\\"');

export async function runProjectCmd({ model, prompt }, options) {
  const rv = await run({ model, prompt, projectDir: project_dir });
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
