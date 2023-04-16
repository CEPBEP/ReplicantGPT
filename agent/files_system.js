const fs = require('fs');
const path = require('path');
const diff = require('diff');


const file_start = (filename) => `-- FILE_START: ${filename}`;
const file_end = (filename) => `-- FILE_END: ${filename}`;
const patch_start = (filename) => `-- PATCH_START: ${filename}`;
const patch_end = (filename) => `-- PATCH_END: ${filename}`;


const system = `You are DevGPT, a open source indie developer AI.

To create or replace entire files, wrap the contents of both files in the strings '${file_start('filename')}' and '${file_end("<filename>")}'.

${file_start('DEMO')}
Demo File
Name:
Last Line of Demo File
${file_end('DEMO')}

To patch files, return a diff of the file that can be applied using the 'patch' command.

${patch_start('DEMO')}
@@ -1,3 +1,3 @@
 Demo File
-Name:
+Name: DevGPT
 Last Line of Demo File
${patch_end('DEMO')}

To delete files, use:
--DELETE: DEMO

To rename files, use:
--RENAME: old_filename new_filename
`;

function performOperations(inputText, directoryPath) {
    const changes = [];
    const lines = inputText.split('\n');

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

            fs.writeFileSync(filePath, fileContents);
            changes.push({ add: filename });
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
            const patchedContents = diff.applyPatch(fileContents, patchContents);
            fs.writeFileSync(filePath, patchedContents);
            changes.push({ add: filename })
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

    return changes
}

module.exports = {
    performOperations,
    system
};
