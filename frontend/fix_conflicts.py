import re
import os

files = [
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages\doctor\DoctorDashboard.jsx",
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages\doctor\DoctorAnalytics.jsx",
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages\patient\PatientHealthTracker.jsx",
    r"c:\Users\HP\Music\MD\ClinicDesk\frontend\src\pages\reception\ReceptionFeedback.jsx"
]

# Regex matches from <<<<<<< HEAD to ======= to >>>>>>> <sha>
pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [a-f0-9a-zA-Z]+', re.DOTALL)

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Taking group 2 (the bottom part of the conflict, which keeps Moon, Sun, etc.)
        new_content = pattern.sub(r'\2', content)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed {f}")
