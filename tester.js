#!/usr/bin/env node

import { runProjectCmd } from './filez.js';

//  Don't output any other text before or after the files. ??
runProjectCmd('node /app/runner.js', {
    PROMPT: "Please create a TODO.md to get the first release of the project done",
    MODEL: "gpt-4"
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

