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
    # The corrupted email address is "S&S Printers" where it should be "sandsprinters26@gmail.com"
    # But we only want to replace it when it's used as an email or in a mailto link.
    # Actually, let's look for "mailto:S&S Printers" or just "S&S Printers" where we suspect an email.
    
    # Simple fix: any "S&S Printers" inside a mailto or as a standalone email-looking string.
    # Or just restore all "sandsprinters26@gmail.com" if they were replaced by "S&S Printers".
    
    # Wait, the script replaced THE LITERAL "sandsprinters26@gmail.com" with "S&S Printers".
    # So I should look for "S&S Printers" and if it looks like it was an email, restore it.
    
    with_email_patterns = [
        r'mailto:S&S Printers',
        r'href="S&S Printers"',
        r'>S&S Printers</a>',
        r'email: "S&S Printers"'
    ]
    
    # Also handle the Edge Function
    edge_func_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\new pranting websit\supabase\functions\send-quote-email\index.ts"
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.html', '.json')):
                file_path = os.path.join(subdir, file)
                replace_in_file(file_path, [r'mailto:S&S Printers'], 'mailto:sandsprinters26@gmail.com')
                replace_in_file(file_path, [r'href="S&S Printers"'], 'href="mailto:sandsprinters26@gmail.com"')
                # Specific case in Navbar and others where the text itself was the email
                # We need to be careful not to replace legitimate brand names.
    
    replace_in_file(edge_func_path, [r'const ADMIN = "S&S Printers";'], 'const ADMIN = "sandsprinters26@gmail.com";')
    # Fix the contact.tsx specifically
    contact_path = os.path.join(root_dir, "routes", "contact.tsx")
    replace_in_file(contact_path, [r'href="mailto:S&S Printers"'], 'href="mailto:sandsprinters26@gmail.com"')
    replace_in_file(contact_path, [r'S&S Printers</div>'], 'sandsprinters26@gmail.com</div>')

if __name__ == "__main__":
    main()
