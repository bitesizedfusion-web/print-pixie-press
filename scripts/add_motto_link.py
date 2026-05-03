import os

file_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\components\hero\VexHero.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the static motto box with a Link
old_motto = """            {/* Floating Motto Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="inline-flex items-center px-8 py-4 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl mt-4"
            >
              <span className="text-xl md:text-2xl font-medium tracking-tight">
                Printing. Packaging. Delivered.
              </span>
            </motion.div>"""

new_motto = """            {/* Floating Motto CTA Button */}
            <Link to="/quote">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileActive={{ scale: 0.95 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl mt-4 cursor-pointer group"
              >
                <span className="text-xl md:text-2xl font-medium tracking-tight flex items-center gap-3">
                  Printing. Packaging. Delivered.
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </motion.div>
            </Link>"""

content = content.replace(old_motto, new_motto)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Motto box in Hero section is now a clickable CTA link to /quote.")
