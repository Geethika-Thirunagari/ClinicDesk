import glob, re

files = glob.glob('src/pages/**/*.jsx', recursive=True)
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace occurrences of {" "} with empty string
        new_content = re.sub(r'\{\s*\"\s*\"\s*\}', '', content)
        
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Cleaned {f}')
    except Exception as e:
        print(f"Error processing {f}: {e}")

print("Done cleaning JSX whitespace nodes.")
