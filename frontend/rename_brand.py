import os

def replace_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # 1. Branding (Exact matches for caps)
        new_content = new_content.replace('FINAI CLINIC', 'ClinicDesk')
        new_content = new_content.replace('FINAI CLINC', 'ClinicDesk')
        new_content = new_content.replace('FINAI', 'ClinicDesk')
        
        # 2. Lowercase/CSS (Exact matches)
        new_content = new_content.replace('finai-card', 'cd-card')
        new_content = new_content.replace('finai-bg', 'cd-bg')
        new_content = new_content.replace('--finai-', '--cd-')
        new_content = new_content.replace('finai-', 'cd-')
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated: {file_path}")
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")

def walk_and_replace(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    src_dir = r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src"
    walk_and_replace(src_dir)
    print("\n🏁 Branding removal complete.")
