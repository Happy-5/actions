const core = require('@actions/core');
const github = require('@actions/github');

try {
  const desc = github.context.payload.pull_request.body;

  if (desc == null || desc.replace(/\W/, "").length < 20) {
    core.setFailed("Please write a description.");
  }
} catch (error) {
  core.setFailed(error.message);
}
