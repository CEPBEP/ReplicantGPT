#!/usr/bin/env node

import { runProjectCmd } from './filez.js';

const work = async () => {
    //  Don't output any other text before or after the files. ??
    const changes = await runProjectCmd('node /app/runner.js', {
        PROMPT: "Please create a TODO.md to get the first release of the project done",
        MODEL: "gpt-3.5-turbo"
    });

    console.log(changes)

    // const commit = await runProjectCmd("node /app/commit.js", {
    //     PROMPT: "Task: Please TODO.md to get the first release of the project done.", 
    //     MODEL: "gpt-3.5-turbo"
    // }).then((result) => {
    //     if (result.exit_code !== 0) {
    //         console.log('error', result);
    //     } else {
    //         console.log(result.stdout);
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // }
}

work()

