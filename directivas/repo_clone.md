# Directiva: Repository Cloning

## Objective
Clone a Git repository into the current workspace or a specified subdirectory.

## Inputs
- `REPO_URL`: The URL of the GitHub repository.
- `TARGET_DIR`: (Optional) The directory where the repo should be cloned. Defaults to `.` (current directory) if intended to be the root, or a specific folder name.

## Logic Flow
1. Verify if the target directory is empty or if cloning is safe.
2. Execute `git clone <REPO_URL> <TARGET_DIR>`.
3. If `<TARGET_DIR>` is `.`, use a temporary directory and move files to avoid git conflicts if the current directory is already a git repo (though in this system, we usually clone into the root if it's empty).
4. Verify the contents after cloning.

## Known Risks and Constraints
- **Existing Files**: Git clone will fail if the target directory is not empty. If cloning into the current workspace root, clone to a temporary subdirectory first and then move files, skipping system folders like `directivas/` and `scripts/`.
- **Auth**: If the repo is private, it requires credentials (though usually public repos are provided).
- **Nested Git**: Avoid creating a git repo inside another git repo unless intended (submodules).

## Rules
- Always check if `git` is installed.
- Use subprocess to run git commands.
- If the current directory is the target and has a `.git` folder already, warn or handle accordingly.

## Steps
1. Define the repository URL.
2. Check if the current directory is empty.
3. Run the clone command.
4. Log the success or failure.
