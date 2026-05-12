# Directive: Git Workflow and Repository Synchronization

## Objective

Ensure the local changes are safely committed and synchronized with the remote GitHub repository.

## Requirements

- **Deterministic Commits**: Always include a clear, descriptive commit message explaining the changes.
- **Atomic Operations**: Stage all relevant changes (src, directivas, scripts) before committing.
- **Push**: Ensure the changes are pushed to the main/master branch.

## Logic Flow

1. **Status Check**: Check for uncommitted changes.
2. **Staging**: Add all new and modified files.
3. **Commit**: Create a commit with a message like "Restored Hero section and updated button labels".
4. **Synchronization**: Push to the remote origin.

## Steps

1. Run `git status`.
2. Run `git add .`.
3. Run `git commit -m "..."`.
4. Run `git push`.
