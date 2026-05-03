import subprocess
import os

def run_git_command(command):
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True, shell=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(e.stderr)
        return False
    return True

# Change directory to the workspace root
os.chdir(r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2")

print("Checking git status...")
run_git_command("git status")

print("Staging changes...")
run_git_command("git add .")

print("Committing changes...")
commit_message = "feat: Restore Hero section with AnimatedHeading and update button labels to 'Get Quote' and 'Explore Now'"
run_git_command(f'git commit -m "{commit_message}"')

print("Pushing to GitHub...")
run_git_command("git push")
