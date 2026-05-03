import os

file_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\components\hero\VexHero.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the Main Headline
# We want to replace the current h1 with AnimatedHeading for a more premium feel, 
# and use the requested "S&S Printing & Packaging" or similar.
# Actually, the user specifically mentioned "printing packaging deliverd", so I'll make that very prominent.

old_h1_section = """              <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[0.8] tracking-tighter mb-8">
                PRINTING.<br />
                PACKAGING.<br />
                <span className="italic text-white/50">DELIVERED.</span>
              </h1>"""

new_h1_section = """              <AnimatedHeading
                text={"S&S Printing\\n& Packaging"}
                className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[0.8] tracking-tighter mb-8"
              />
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1000, duration: 1 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-px w-12 bg-white/30" />
                <span className="text-xl md:text-2xl font-light italic text-white/50 tracking-widest uppercase">
                  Printing. Packaging. Delivered.
                </span>
              </motion.div>"""

content = content.replace(old_h1_section, new_h1_section)

# 2. Ensure Button Labels are exactly "Get Quote" and "Explore Now"
# The current version already has them, but let's be sure.

# Check for "Get Quote"
if "Get Quote" not in content and "Start Project" in content:
    content = content.replace("Start Project", "Get Quote")

# Check for "Explore Now"
if "Explore Now" not in content and "Our Solutions" in content:
    content = content.replace("Our Solutions", "Explore Now")

# Also ensure the header button is "Get Quote"
content = content.replace("Get a Quote", "Get Quote")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Hero section restored and updated with requested labels.")
