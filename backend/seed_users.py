"""
Seed script: creates Doctor, Receptionist, and Patient demo accounts.
Run from the backend directory: python seed_users.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile, Doctor, Patient
import datetime

PASSWORD = 'ClinicDesk@2025!'

USERS = [
    {
        'email': 'doctor@clinicdesk.com',
        'username': 'doctor',
        'first_name': 'Sarah',
        'last_name': 'Smith',
        'role': 'doctor',
    },
    {
        'email': 'desk@clinicdesk.com',
        'username': 'desk',
        'first_name': 'James',
        'last_name': 'Reception',
        'role': 'receptionist',
    },
    {
        'email': 'patient@clinicdesk.com',
        'username': 'patient',
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'role': 'patient',
    },
]

for u_data in USERS:
    email = u_data['email']
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'username': u_data['username'],
            'first_name': u_data['first_name'],
            'last_name': u_data['last_name'],
        }
    )
    if created:
        user.set_password(PASSWORD)
        user.save()
        print(f"✅ Created user: {email}")
    else:
        # make sure password is correct
        user.set_password(PASSWORD)
        user.save()
        print(f"🔄 Updated password for existing user: {email}")

    # Create or update the profile
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.role = u_data['role']
    profile.save()
    print(f"   Role set to: {u_data['role']}")

    # If doctor, create Doctor profile
    if u_data['role'] == 'doctor':
        Doctor.objects.get_or_create(
            user=user,
            defaults={
                'specialization': 'Cardiology',
                'license_number': f'LIC-{user.id:04d}',
                'bio': 'Senior Cardiologist with 12 years of experience.',
            }
        )
        print(f"   Doctor profile created/ensured.")

    # If patient, create Patient profile
    if u_data['role'] == 'patient':
        Patient.objects.get_or_create(
            user=user,
            defaults={
                'date_of_birth': datetime.date(1990, 5, 15),
                'blood_group': 'O+',
                'emergency_contact_name': 'Bob Johnson',
                'emergency_contact_phone': '+1-555-0101',
            }
        )
        print(f"   Patient profile created/ensured.")

print("\n✅ Seeding complete. All demo accounts are ready.")
print(f"\nCredentials (all use password: {PASSWORD})")
print("  Admin:       admin@clinicdesk.com")
print("  Doctor:      doctor@clinicdesk.com")
print("  Receptionist: desk@clinicdesk.com")
print("  Patient:     patient@clinicdesk.com")
