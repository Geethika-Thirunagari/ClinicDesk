export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const APP_CONFIG = {
  appName: 'ClinicDesk',
  version: '1.0.0',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
};
