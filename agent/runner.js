import { Configuration, OpenAIApi } from "openai";
import * as files from "./files_system.js";
import {performCommit, commitInstructions} from './commit_system.js';


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const run = async ({ model, prompt, projectDir }) => {

    const completion = await openai.createChatCompletion({
        model,
        messages: [{
            role: "system", content: files.system,
        }, {
            role: "user", content: prompt,
        }],
    });

    const changeTxt = completion.data.choices[0].message.content;
    const changes = files.performOperations(changeTxt, projectDir);
    console.log(changes);

    const results = await openai.createChatCompletion({
        model: model,
        messages: [
            { role: "system", content: files.system, },
            { role: "user", content: prompt, },
            { role: 'assistant', content: changeTxt },
            { role: 'user', content: commitInstructions }
        ],
    });

    const commitMessage = results.data.choices[0].message.content;

    await performCommit({ message: commitMessage, changes }, projectDir);
}

export default run;