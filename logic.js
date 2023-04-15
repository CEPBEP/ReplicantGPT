import { Octokit, App } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

if (!process.env.GITHUB_TOKEN) {
  console.error("GITHUB_TOKEN is not set");
  process.exit(1);
}

async function getIssue(owner, repo, issue_number) {
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
