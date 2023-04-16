import { exec } from "child_process";

export const commitInstructions = `Great!  Now it is time to commit your work.  Please enter a commit message in:

-- COMMIT_START
commit message
-- COMMIT_END`;

export async function performCommit({ message, changes }, directoryPath) {
  function git(...args) {
    return new Promise((resolve, reject) => {
      const cmd = `cd ${directoryPath} && git ${args.join(" ")}`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  for (const change of changes) {
    if (change.add) {
      await git("add", change.add);
    }
    if (change.rm) {
      await git("rm", change.rm);
    }
  }

  message = message
    .split("-- COMMIT_START")[1]
    .split("-- COMMIT_END")[0]
    .trim();

  const msg = '"' + message.replace(/"/g, '\\"') + '"';
  await git("commit", "-m", msg);
  await git("push", "origin", "main");
}
