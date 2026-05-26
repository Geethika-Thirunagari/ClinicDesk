/**
 * ClinicDesk — Route Constants
 * Single source of truth for all application paths.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────
export const ROUTES = {
  // Public / Auth
  LOGIN:           '/login',
  REGISTER:        '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD:  '/reset-password/:token',
  UNAUTHORIZED:    '/unauthorized',
  NOT_FOUND:       '/404',

  // ── Admin ──────────────────────────────────────────────────────────────────
  ADMIN: {
    ROOT:         '/admin',
    DASHBOARD:    '/admin/dashboard',
    DOCTORS:      '/admin/doctors',
    PATIENTS:     '/admin/patients',
    STAFF:        '/admin/staff',
    BEDS:         '/admin/beds',
    PHARMACY:     '/admin/pharmacy',
    REVENUE:      '/admin/revenue',
    REPORTS:      '/admin/reports',
    SETTINGS:     '/admin/settings',
    AUDIT:        '/admin/audit',
    INVENTORY:    '/admin/inventory',
  },

  // ── Doctor ─────────────────────────────────────────────────────────────────
  DOCTOR: {
    ROOT:         '/doctor',
    DASHBOARD:    '/doctor/dashboard',
    APPOINTMENTS: '/doctor/appointments',
    RECORDS:      '/doctor/records',
    PRESCRIPTIONS:'/doctor/prescriptions',
    SCHEDULE:     '/doctor/schedule',
    NOTIFICATIONS:'/doctor/notifications',
    REVIEWS:      '/doctor/reviews',
    TELECONSULT:  '/doctor/teleconsult',
    AI_ASSISTANT: '/doctor/ai-assistant',
    ANALYTICS:    '/doctor/analytics',
  },

  // ── Receptionist ───────────────────────────────────────────────────────────
  RECEPTIONIST: {
    ROOT:         '/reception',
    DASHBOARD:    '/reception/dashboard',
    BOOKING:      '/reception/booking',
    QUEUE:        '/reception/queue',
    BILLING:      '/reception/billing',
    REGISTRATION: '/reception/registration',
    CHECKIN:      '/reception/checkin',
    FEEDBACK:     '/reception/feedback',
  },

  // ── Patient ────────────────────────────────────────────────────────────────
  PATIENT: {
    ROOT:          '/patient',
    DASHBOARD:     '/patient/dashboard',
    BOOK:          '/patient/book',
    HISTORY:       '/patient/history',
    PRESCRIPTIONS: '/patient/prescriptions',
    PAYMENTS:      '/patient/payments',
    NOTIFICATIONS: '/patient/notifications',
    PROFILE:       '/patient/profile',
    HEALTH_TRACKER:  '/patient/health-tracker',
    SYMPTOM_CHECKER: '/patient/symptom-checker',
  },
};

export const buildPath = (template, params = {}) =>
  Object.entries(params).reduce(
    (path, [key, val]) => path.replace(`:${key}`, val),
    template
  );
