import subprocess
import os

def run_command(command):
    print(f"Executing: {command}")
    result = subprocess.run(command, capture_output=True, text=True, shell=True)
    if result.returncode == 0:
        print("Success:")
        print(result.stdout)
    else:
        print("Error:")
        print(result.stderr)
    return result.returncode == 0

# Workspace root
root = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2"
os.chdir(root)

run_command("git add .")
run_command('git commit -m "feat: Synchronize hero section with user provided reference image layout"')
run_command("git push origin main")
