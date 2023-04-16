const { Configuration, OpenAIApi } = require("openai");
const files = require("./files_system.js");
const commits = require('./commit_system.js')


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const run = async () => {

    const completion = await openai.createChatCompletion({
        model: process.env.MODEL,
        messages: [{
            role: "system", content: files.system,
        }, {
            role: "user", content: process.env.PROMPT,
        }],
    });

    const changeTxt = completion.data.choices[0].message.content;
    const changes = files.performOperations(changeTxt, '/project');
    console.log(changes);

    const results = await openai.createChatCompletion({
        model: process.env.MODEL,
        messages: [
            { role: "system", content: files.system, },
            { role: "user", content: process.env.PROMPT, },
            { role: 'assistant', content: changeTxt },
            { role: 'user', content: commits.commitInstructions }
        ],
    });

    const commitMessage = results.data.choices[0].message.content;

    await commits.performCommit({ message: commitMessage, changes }, '/project');
}

run();