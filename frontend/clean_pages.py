import os
import re

def clean_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # 1. Remove double padding patterns like p-4 lg:p-8 on main containers
        # Look for motion.div or div that starts the component
        new_content = re.sub(r'className="space-y-6 p-4 lg:p-8 min-h-screen"', 'className="space-y-6 font-[\'Outfit\']"', new_content)
        new_content = re.sub(r'className="space-y-6 p-4 lg:p-8"', 'className="space-y-6 font-[\'Outfit\']"', new_content)
        new_content = re.sub(r'className="space-y-6 p-6 lg:p-10"', 'className="space-y-6 font-[\'Outfit\']"', new_content)
        
        # 2. Ensure we use CD branding classes instead of FINAI
        new_content = new_content.replace('finai-card', 'cd-card')
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"🧹 Cleaned: {file_path}")
    except Exception as e:
        print(f"❌ Error: {file_path} -> {e}")

def walk_and_clean(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                clean_file(os.path.join(root, file))

if __name__ == "__main__":
    src_pages = r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages"
    walk_and_clean(src_pages)
    print("\n🏁 Cleanup complete.")
