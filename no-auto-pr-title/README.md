# No Auto PR Title

Github action that will fail if PR title =~ branch name.

Example workflow file:
```yaml
name: PR Lint

on: { pull_request: { types: [opened, edited, reopened] } }

jobs:
  Good-title:
    runs-on: ubuntu-latest
    steps:
    - uses: happy-5/actions/no-auto-pr-title@master
```
