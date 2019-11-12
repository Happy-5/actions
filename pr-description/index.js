const core = require('@actions/core');
const github = require('@actions/github');

try {
  console.log(JSON.stringify(github.context.payload.pull_request, null, 2));
  const desc = github.context.payload.pull_request.description;

  if (desc == null || desc.replace(/\W/, "").length < 20) {
    core.setFailed("Please write a description.");
  }
} catch (error) {
  core.setFailed(error.message);
}
