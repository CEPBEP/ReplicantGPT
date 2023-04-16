import { Configuration, OpenAIApi } from 'openai';
import { performOperations, system } from './commit_system.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const run = async () => {
  const completion = await openai.createChatCompletion({
    model: process.env.MODEL,
    messages: [
      {
        role: 'system',
        content: system,
      },
      {
        role: 'user',
        content: process.env.PROMPT,
      },
    ],
  });

  const result = completion.data.choices[0].message;

  console.log({ result });
  performOperations(result.content, '/project');
};

run();
