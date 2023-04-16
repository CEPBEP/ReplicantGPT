const fs = require('fs');
const path = require('path');
const diff = require('diff');
const { exec } = require('child_process');

const commitInstructions = `Great!  Now it is time to commit your work.  Please enter a commit message in:

-- COMMIT_START
commit message
-- COMMIT_END`


async function performCommit({ message, changes }, directoryPath) {

    function git(...args) {
        return new Promise((resolve, reject) => {
            const cmd = `cd /project && git ${args.join(' ')}`;
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
            await git('add', change.add);
        }
        if (change.rm) {
            await git('rm', change.rm);
        }
    }

    message = message.split('-- COMMIT_START')[1].split('-- COMMIT_END')[0].trim();

    const msg = '"' + message.replace(/"/g, '\\"') + '"';
    await git('commit', '-m', msg);
}

function performOperations(inputText, directoryPath) {
    const lines = inputText.split('\n');

    let changes = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        console.log(line)

        if (line.startsWith('-- FILE_START:')) {
            const filename = line.split(':')[1].trim();
            console.log('creating file', filename);
            const filePath = path.join(directoryPath, filename);
            console.log(filePath)
            let fileContents = '';

            i++;

            while (i < lines.length && !lines[i].startsWith('-- FILE_END:')) {
                fileContents += lines[i] + '\n';
                i++;
            }

            changes.push({ add: filename });
            fs.writeFileSync(filePath, fileContents);
        } else if (line.startsWith('-- PATCH_START:')) {
            const filename = line.split(':')[1].trim();
            console.log('patching file', filename);
            const filePath = path.join(directoryPath, filename);
            let patchContents = '';

            i++;

            while (i < lines.length && !lines[i].startsWith('-- PATCH_END:')) {
                patchContents += lines[i] + '\n';
                i++;
            }

            const fileContents = fs.readFileSync(filePath, 'utf8');
            // FIXME(ja): what if the patch fails
            const patchedContents = diff.applyPatch(fileContents, patchContents);
            fs.writeFileSync(filePath, patchedContents);

            changes.push({ add: filename });
        } else if (line.startsWith('-- DELETE:')) {
            const filename = line.split(':')[1].trim();
            console.log('deleting file', filename);
            const filePath = path.join(directoryPath, filename);
            fs.unlinkSync(filePath);

            changes.push({ rm: filename });
        } else if (line.startsWith('-- RENAME:')) {
            const [oldFilename, newFilename] = line.split(':')[1].trim().split(' ');
            console.log('renaming file', oldFilename, 'to', newFilename);
            const oldFilePath = path.join(directoryPath, oldFilename);
            const newFilePath = path.join(directoryPath, newFilename);
            fs.renameSync(oldFilePath, newFilePath);

            changes.push({ rm: oldFilename, add: newFilename });
        }
    }
    return changes;
}

module.exports = {
    performOperations,
    performCommit,
    commitInstructions
};
