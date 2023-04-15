#!/usr/bin/env node

import { runProjectCmd } from './filez.js';

const file_start = (filename) => `-- FILE_START: ${filename}`;
const file_end = (filename) => `-- FILE_END: ${filename}`;
const patch_start = (filename) => `-- PATCH_START: ${filename}`;
const patch_end = (filename) => `-- PATCH_END: ${filename}`;

//  Don't output any other text before or after the files. ??
runProjectCmd('node /app/runner.js', {
    PROMPT: "Please create a README.md for your html5 version of Duck Hunter",
    SYSTEM: `You are DevGPT, a open source indie developer AI.

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
`,
    MODEL: "gpt-3.5-turbo"
}).then((result) => {
    if (result.exit_code !== 0) {
        console.log('error', result);
    } else {
        console.log(result.stdout);
    }

}
).catch((error) => {
    console.log(error);
})

