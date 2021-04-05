# Annotate RuboCop GitHub Action

GitHub Action for creating annotations from RuboCop results. Forked from https://github.com/duderman/rubocop-annotate-action

## Usage

```yml
name: Rubocop

on: push

jobs:
  rubocop:
    name: Rubocop
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-ruby@v1
        with:
          ruby-version: '2.7'
      - run: gem install rubocop --no-doc
      - run: rubocop --format progress --format json --out rubocop.json
        id: rubocop
      - uses: duderman/rubocop-annotate-action@v0.1.0
        with:
          path: rubocop.json
          defaultLevel: error
          levels: |
            {
              info: "notice",
              refactor: "warning",
              convention: "warning",
            }
        if: ${{ always() }}
```
