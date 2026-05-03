import os

file_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\quote.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update handleImageChange to be more robust
# We'll add e.stopPropagation() directly to the input call instead.

# 2. Update the input type="file" onChange to stop propagation
old_input = '<input type="file" className="hidden" onChange={e => handleImageChange(s.id, e.target.files?.[0] || null)} />'
new_input = '<input type="file" className="hidden" onClick={e => e.stopPropagation()} onChange={e => { e.stopPropagation(); handleImageChange(s.id, e.target.files?.[0] || null); }} />'

content = content.replace(old_input, new_input)

# 3. Double check the handleSubmit to ensure it only runs on step 3
# It already has: if (currentStep !== 3) return;

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Quote form fixed: Image upload no longer triggers auto-submission.")
