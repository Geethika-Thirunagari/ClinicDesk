import os
import re

directories = [
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\components\admin",
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages\admin"
]

def cleanse_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Strip all dark: classes safely
    content = re.sub(r'\bdark:[a-zA-Z0-9\-\/\[\]]+\s*', '', content)
    
    # 2. Simplify the old glassmorphism into standard FINAI card
    content = content.replace('bg-white/60', 'bg-white')
    content = content.replace('backdrop-blur-xl', '')
    content = content.replace('border-white/40', 'border-[#e2e8e2]')
    content = content.replace('rounded-2xl', 'rounded-[24px]')
    content = content.replace('shadow-sm', 'shadow-[0_4px_20px_rgba(0,0,0,0.02)]')

    # 3. Clean up slate-800 to #0a1a0f
    content = content.replace('text-slate-800', 'text-[#0a1a0f]')

    # Optional: remove multiple spaces created by stripping
    content = re.sub(r'\s{2,}', ' ', content)
    
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
