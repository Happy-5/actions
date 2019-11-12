const core = require('@actions/core');
const github = require('@actions/github');

const sanitize = (str) => str.replace(/[^a-z\/]/gi, " ")

try {
  const title = github.context.payload.pull_request.title.toLowerCase();
  const branch = github.context.payload.pull_request.head.ref.toLowerCase();

  if (sanitize(title) === sanitize(branch)) {
    core.setFailed("Please write a more descriptive PR title. Don't depend on branch name!");
  }
} catch (error) {
  core.setFailed(error.message);
}
