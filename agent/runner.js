const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const run = async () => {

    const completion = await openai.createChatCompletion({
        model: process.env.MODEL,
        messages: [{
            role: "system", content: process.env.SYSTEM,
        }, {
            role: "user", content: process.env.PROMPT,
        }],
    });

    console.log(completion.data.choices[0].message);
}

run();