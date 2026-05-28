import waitress
from core.wsgi import application

if __name__ == '__main__':
    print("🚀 Starting ClinicDesk Production Server on http://localhost:8000...")
    waitress.serve(application, host='0.0.0.0', port=8000)
