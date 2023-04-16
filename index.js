import express from 'express'
import cors from 'cors'
import asyncHandler from 'express-async-handler'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Replicate from 'replicate'
import * as dotenv from 'dotenv'
import { listFiles, getFile } from './filez.js';
import { runProjectCmd } from './filez.js';

dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(cors({ origin: 'https://chat.openai.com' }))
app.use(express.json())

app.post('/code', asyncHandler(async (req, res) => {
  console.log('code', req.body)
  const { prompt, model = 'gpt-3.5-turbo' } = req.body;

  runProjectCmd({ prompt, model }).then(s => {
    console.log({ 'result': s })
  }); // FIXME(ja): some way of canceling!

  res.status(200).json({ status: 'coding has started, the coder will send a PR when it is ready' })
}))

app.post("/list_files", asyncHandler(async (req, res) => {
  console.log("list", req.body)
  const { base_directory } = req.body;

  const files = await listFiles();

  res.json(files)
}))

app.post("/get", asyncHandler(async (req, res) => {
  console.log("get", req.body)
  const { filename } = req.body;

  const content = await getFile(filename);

  res.json({ content })
}))

app.get('/logo.png', asyncHandler(async (req, res) => {
  const filename = path.join(__dirname, 'logo.png')
  res.sendFile(filename, { headers: { 'Content-Type': 'image/png' } })
}))

app.get('/.well-known/ai-plugin.json', asyncHandler(async (req, res) => {
  const filename = path.join(__dirname, '.well-known', 'ai-plugin.json')
  res.sendFile(filename, { headers: { 'Content-Type': 'application/json' } })
}))

app.get('/openapi.yaml', asyncHandler(async (req, res) => {
  const filename = path.join(__dirname, 'openapi.yaml')
  res.sendFile(filename, { headers: { 'Content-Type': 'text/yaml' } })
}))

const main = () => {
  app.listen(5003, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5003')
  })
}

main()
