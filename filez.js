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

export async function getFile({ filename, project_id }) {
  filename = path.join(project_dir, filename);
  return await fs.readFile(filename, "utf8");
}
