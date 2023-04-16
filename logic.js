import { Octokit, App } from "octokit";
import * as dotenv from "dotenv";
dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

if (!process.env.GITHUB_TOKEN) {
  console.error("GITHUB_TOKEN is not set");
  process.exit(1);
}

export async function getIssue(owner, repo, issue_number) {
  const issue = await octokit.rest.issues.get({
    owner: owner,
    repo: repo,
    issue_number: issue_number,
  });

  const issue_data = {
    number: issue.data.number,
    title: issue.data.title,
    state: issue.data.state,
    body: issue.data.body,
  };

  return issue_data;
}

export async function getIssues(owner, repo, state) {
  const issues = await octokit.rest.issues.listForRepo({
    owner: owner,
    repo: repo,
    state: state,
  });

  const issues_data = issues.data.map((issue) => {
    return {
      number: issue.number,
      title: issue.title,
      state: issue.state,
    };
  });

  return issues_data;
}

export async function createIssue(owner, repo, title, body) {
  const issue = await octokit.rest.issues.create({
    owner: owner,
    repo: repo,
    title: title,
    body: body,
  });

  const issue_data = {
    number: issue.data.number,
    title: issue.data.title,
    state: issue.data.state,
    body: issue.data.body,
  };

  return issue_data;
}

export async function updateIssue(owner, repo, issue_number, title, body) {
  const issue = await octokit.rest.issues.update({
    owner: owner,
    repo: repo,
    issue_number: issue_number,
    title: title,
    body: body,
  });

  const issue_data = {
    number: issue.data.number,
    title: issue.data.title,
    state: issue.data.state,
    body: issue.data.body,
  };

  return issue_data;
}

export async function closeIssue(owner, repo, issue_number) {
  const issue = await octokit.rest.issues.update({
    owner: owner,
    repo: repo,
    issue_number: issue_number,
    state: "closed",
  });

  const issue_data = {
    number: issue.data.number,
    title: issue.data.title,
    state: issue.data.state,
    body: issue.data.body,
  };

  return issue_data;
}

export async function commentIssue(owner, repo, issue_number, body) {
  const comment = await octokit.rest.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: issue_number,
    body: body,
  });

  const comment_data = {
    id: comment.data.id,
    body: comment.data.body,
  };

  return comment_data;
}
