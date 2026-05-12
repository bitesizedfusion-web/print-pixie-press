import os
import re

def replace_in_file(file_path, search_patterns, replacement):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern in search_patterns:
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

def main():
    root_dir = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\new pranting websit\src"
    search_patterns = [
        r"S&S Printing and Packaging",
        r"S&S Printers and Packaging",
        r"S&S Printing & Packaging",
        r"S&S Printing\s*<br\s*/?>\s*and Packaging", # Added multiline support
        r"S&S Printing\s*<br\s*/?>\s*Packaging",
        r"sandsprinters26@gmail.com"
    ]
    replacement = "S&S Printers"
    
    # Also handle HTML entities if they exist
    search_patterns_html = [
        r"S&amp;S Printing and Packaging",
        r"S&amp;S Printers and Packaging"
    ]
    
    all_patterns = search_patterns + search_patterns_html
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.html', '.json')):
                file_path = os.path.join(subdir, file)
                replace_in_file(file_path, all_patterns, replacement)

if __name__ == "__main__":
    main()
