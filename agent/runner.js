import { Configuration, OpenAIApi } from "openai";
import * as files from "./files_system.js";
import { performCommit, commitInstructions } from './commit_system.js';
import { promises as fs } from 'fs';


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chat = async ({ model, messages }) => {
    const logFn = "logs/" + (new Date().toISOString().replace(/:/g, '-') + Math.random().toString(36).substring(7) + '.json');
    await fs.writeFile(logFn, JSON.stringify({ messages, model }, null, 2));
    const response = await openai.createChatCompletion({ model, messages })
    const message = response.data.choices[0].message
    await fs.writeFile(logFn, JSON.stringify({ messages, model, response: message }, null, 2));
    return message;
}

const run = async ({ model, prompt, projectDir }) => {
    const messages = [
        { role: "system", content: files.system },
        { role: "user", content: prompt }
    ]
    // todo: add the list of files into the prompt / message history

    let message = await chat({ model, messages });
    messages.push(message)
    // todo: if the bot asks for a --CAT: file1, ... return that, and re-run the previous prompt

    console.log({ message })
    const changes = files.performOperations(message.content, projectDir);
    console.log({ changes });

    messages.push({ role: 'user', content: commitInstructions });

    message = await chat({ model, messages });

    await performCommit({ message: message.content, changes }, projectDir);
}

export default run;