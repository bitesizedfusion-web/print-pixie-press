import os
import subprocess
import shutil
from pathlib import Path

def clone_repo(repo_url, target_root):
    temp_dir = Path(target_root) / ".tmp" / "repo_temp"
    
    # Remove temp_dir if it exists
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    
    print(f"Cloning {repo_url} into {temp_dir}...")
    try:
        subprocess.run(["git", "clone", repo_url, str(temp_dir)], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error cloning repository: {e}")
        return

    print("Moving files to root...")
    for item in os.listdir(temp_dir):
        s = temp_dir / item
        d = Path(target_root) / item
        
        # Skip if it's our system folders
        if item in ["directivas", "scripts", ".tmp"]:
            continue
            
        if d.exists():
            if d.is_dir():
                shutil.rmtree(d)
            else:
                os.remove(d)
        
        shutil.move(str(s), str(d))
    
    # Cleanup temp dir
    shutil.rmtree(temp_dir)
    print("Repository cloned and files moved to root successfully.")

if __name__ == "__main__":
    REPO_URL = "https://github.com/bitesizedfusion-web/print-pixie-press.git"
    ROOT = "c:\\Users\\Mohammed Shishir\\OneDrive\\Desktop\\websites\\austlia prating busines 2"
    clone_repo(REPO_URL, ROOT)
