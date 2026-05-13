# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues in the current repository. Use the `gh` CLI for all operations.

## Conventions

- Create an issue with `gh issue create --title "..." --body "..."`.
- Read an issue with `gh issue view <number> --comments`.
- List issues with `gh issue list` and the appropriate filters.
- Apply labels with `gh issue edit <number> --add-label "..."`.
- Infer the repo from `git remote -v`; `gh` does this automatically when run inside the clone.

## When a skill says "publish to the issue tracker"

Create a GitHub issue in the current repository.
