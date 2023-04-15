const fs = require('fs');
const path = require('path');
const diff = require('diff');

function performOperations(inputText, directoryPath) {
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
        } else if (line.startsWith('-- DELETE:')) {
            const filename = line.split(':')[1].trim();
            console.log('deleting file', filename);
            const filePath = path.join(directoryPath, filename);
            fs.unlinkSync(filePath);
        } else if (line.startsWith('-- RENAME:')) {
            const [oldFilename, newFilename] = line.split(':')[1].trim().split(' ');
            console.log('renaming file', oldFilename, 'to', newFilename);
            const oldFilePath = path.join(directoryPath, oldFilename);
            const newFilePath = path.join(directoryPath, newFilename);
            fs.renameSync(oldFilePath, newFilePath);
        }
    }
}

module.exports = {
    performOperations,
};
