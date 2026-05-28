import os
import re

directories = [
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\components\admin",
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages\admin"
]

def cleanse_theme(filepath):
    # Do not mess with AdminDashboard or AdminRevenue as they were completely rewritten perfectly
    if "AdminDashboard.jsx" in filepath or "AdminRevenue.jsx" in filepath:
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Strip all dark: classes safely
    content = re.sub(r'\bdark:[a-zA-Z0-9\-\/\[\]]+\s*', '', content)
    
    # 2. Simplify the old glassmorphism into standard FINAI card
    content = content.replace('bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl', 'finai-card')
    content = content.replace('bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm', 'finai-card')
    content = content.replace('bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm', 'finai-card')
    content = content.replace('bg-white/60 backdrop-blur-xl', 'bg-white')
    content = content.replace('border-white/40', 'border-[#e2e8e2]')
    content = content.replace('rounded-2xl', 'rounded-[24px]')
    content = content.replace('bg-slate-900', 'bg-[#0a1a0f]')
    
    # 3. Clean up generic dark text to the signature FINAI dark primary text
    content = content.replace('text-slate-800', 'text-[#0a1a0f]')
    content = content.replace('text-slate-900', 'text-[#0a1a0f]')

    # 4. We do NOT strip whitespaces to preserve comments and layout
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Standardized {os.path.basename(filepath)}")

for d in directories:
    if os.path.exists(d):
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(".jsx"):
                    cleanse_theme(os.path.join(root, file))
print("Done!")
