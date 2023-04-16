import express from "express";
import cors from "cors";
import asyncHandler from "express-async-handler";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Replicate from "replicate";
import * as dotenv from "dotenv";
import { listFiles, runCommand } from "./filez.js";
import {
  getIssue,
  getIssues,
  createIssue,
  updateIssue,
  closeIssue,
  commentIssue,
} from "./logic.js";
import morgan from "morgan";

dotenv.config();

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

const app = express();
app.use(morgan("dev")); // Use morgan middleware to log all incoming requests

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OWNER = "cbh123";
const REPO = "shlinked";

app.use(cors({ origin: "https://chat.openai.com" }));
app.use(express.json());

app.post(
  "/run",
  asyncHandler(async (req, res) => {
    console.log("run", req.body);
    const { cmd, stdout = true, stderr = false, timeout = 10 } = req.body;

    const options = {
      timeout: timeout * 1000,
    };

    try {
      const result = await runCommand(cmd, options);
      res.status(200).json({
        exit_code: result.exit_code,
        stdout: stdout ? result.stdout : undefined,
        stderr: stderr ? result.stderr : undefined,
      });
    } catch (error) {
      console.log(error);
      res.status(error.status).json({
        error: error.message,
        stdout: stdout ? error.stdout : undefined,
        stderr: stderr ? error.stderr : undefined,
      });
    }
  })
);

app.post(
  "/list_files",
  asyncHandler(async (req, res) => {
    console.log("list", req.body);
    const { base_directory } = req.body;

    const files = await listFiles(base_directory);
    // list files

    res.json(files);
  })
);

app.post(
  "/model",
  asyncHandler(async (req, res) => {
    console.log("model", req.body);
    const { username, model } = req.body;
    const response = await replicate.models.get(username, model);
    const output = {
      url: response.url,
      version: response.latest_version.id,
      description: response.description,
      schema: response.latest_version.openapi_schema,
    };
    res.status(200).json(output);
  })
);

app.post(
  "/collections",
  asyncHandler(async (req, res) => {
    console.log("collections");
    res.status(200).json([
      {
        slug: "image-to-text",
        description: "Models that generate images from text prompts",
      },
      {
        slug: "audio-generation",
        description: "Models to generate and modify audio",
      },
      {
        slug: "diffusion-models",
        description:
          "Image and video generation models trained with diffusion processes",
      },
      {
        slug: "image-restoration",
        description:
          "Models that improve or restore images by deblurring, colorization, and removing noise",
      },
      {
        slug: "ml-makeovers",
        description: "Models that let you change facial features",
      },
      {
        slug: "super-resolution",
        description:
          "Upscaling models that create high-quality images from low-quality images",
      },
      {
        slug: "text-to-video",
        description: "Models that create and edit videos",
      },
      {
        slug: "style-transfer",
        description: "Models that transfer the style of one image to another",
      },
    ]);
  })
);

app.post(
  "/collection",
  asyncHandler(async (req, res) => {
    console.log("collection", req.body);
    const { collection_slug } = req.body;
    const response = await replicate.collections.get(collection_slug);
    const models = response.models.map((model) => {
      return {
        url: model.url,
        username: model.owner,
        model: model.name,
        version: model.latest_version.id,
        description: model.description,
      };
    });

    res.status(200).json(models);
  })
);

/**
 * GitHub issue routes
 **/

// create issue
app.post(
  "/repos/:owner/:repo/issues",
  asyncHandler(async (req, res) => {
    const { owner, repo } = req.params;
    const { title, body } = req.body;
    console.log(title, body);
    const issueData = await createIssue(OWNER, REPO, title, body);
    res.status(200).json(issueData);
  })
);

// get issues
app.get(
  "/repos/:owner/:repo/issues",
  asyncHandler(async (req, res) => {
    const { owner, repo } = req.params;
    const issueData = await getIssues(OWNER, REPO);
    res.status(200).json(issueData);
  })
);

// get issue
app.get(
  "/repos/:owner/:repo/issues/:issue_number",
  asyncHandler(async (req, res) => {
    const { owner, repo, issue_number } = req.params;
    const issueData = await getIssue(OWNER, REPO, issue_number);

    res.status(200).json(issueData);
  })
);

// update issue
app.put(
  "/repos/:owner/:repo/issues/:issue_number",
  asyncHandler(async (req, res) => {
    const { owner, repo } = req.params;
    const { title, body, issue_number } = req.body;
    const issueData = await updateIssue(OWNER, REPO, issue_number, title, body);
    res.status(200).json(issueData);
  })
);

// close issue
app.patch(
  "/repos/:owner/:repo/issues/:issue_number",
  asyncHandler(async (req, res) => {
    const { owner, repo, issue_number } = req.params;
    const issueData = await closeIssue(OWNER, REPO, issue_number);
    res.status(200).json(issueData);
  })
);

// comment on issue
app.post(
  "/repos/:owner/:repo/issues/:issue_number/comments",
  asyncHandler(async (req, res) => {
    const { owner, repo, issue_number } = req.params;
    const { body } = req.body;
    const issueData = await commentIssue(owner, repo, issue_number, body);
    res.status(200).json(issueData);
  })
);

app.get(
  "/logo.png",
  asyncHandler(async (req, res) => {
    const filename = path.join(__dirname, "logo.png");
    res.sendFile(filename, { headers: { "Content-Type": "image/png" } });
  })
);

app.get(
  "/.well-known/ai-plugin.json",
  asyncHandler(async (req, res) => {
    const filename = path.join(__dirname, ".well-known", "ai-plugin.json");
    res.sendFile(filename, { headers: { "Content-Type": "application/json" } });
  })
);

app.get(
  "/openapi.yaml",
  asyncHandler(async (req, res) => {
    const filename = path.join(__dirname, "openapi.yaml");
    res.sendFile(filename, { headers: { "Content-Type": "text/yaml" } });
  })
);

const main = () => {
  app.listen(5003, "0.0.0.0", () => {
    console.log("Server running on http://0.0.0.0:5003");
  });
};

main();
