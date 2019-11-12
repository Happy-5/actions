# PR Description

Github action that will fail if PR description is empty

Example workflow file:
```yaml
name: PR Lint

on: { pull_request: { types: [opened, edited, reopened] } }

jobs:
  Have-description:
    runs-on: ubuntu-latest
    steps:
    - uses: happy-5/actions/pr-description@master
```
