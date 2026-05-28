import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';

// ── Context & Layouts ──────────────
import AuthInitializer from '../components/auth/AuthInitializer';
import { ProtectedRoute, RoleGuard, GuestRoute } from './guards';
import { ROUTES, buildPath } from './routes.constants';
import { ROLES } from '../store/useAuthStore';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// ── Lazy Loading ──────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
  </div>
);

// Auth Pages
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));

// ── Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminDoctors = lazy(() => import('../pages/admin/AdminDoctors'));
const AdminPatients = lazy(() => import('../pages/admin/AdminPatients'));
const AdminRevenue = lazy(() => import('../pages/admin/AdminRevenue'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminStaff = lazy(() => import('../pages/admin/AdminStaff'));
const AdminBeds = lazy(() => import('../pages/admin/AdminBeds'));
const AdminPharmacy = lazy(() => import('../pages/admin/AdminPharmacy'));
const AdminAudit = lazy(() => import('../pages/admin/AdminAudit'));
const AdminInventory = lazy(() => import('../pages/admin/AdminInventory'));

// ── Doctor Pages
const DoctorDashboard = lazy(() => import('../pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('../pages/doctor/DoctorAppointments'));
const DoctorRecords = lazy(() => import('../pages/doctor/DoctorRecords'));
const DoctorPrescriptions = lazy(() => import('../pages/doctor/DoctorPrescriptions'));
const DoctorSchedule = lazy(() => import('../pages/doctor/DoctorSchedule'));
const DoctorNotifications = lazy(() => import('../pages/doctor/DoctorNotifications'));
const DoctorReviews = lazy(() => import('../pages/doctor/DoctorReviews'));
const DoctorTeleconsult = lazy(() => import('../pages/doctor/DoctorTeleconsult'));
const DoctorAIAssistant = lazy(() => import('../pages/doctor/DoctorAIAssistant'));
const DoctorAnalytics = lazy(() => import('../pages/doctor/DoctorAnalytics'));

// ── Receptionist Pages
const ReceptionDashboard = lazy(() => import('../pages/reception/ReceptionDashboard'));
const ReceptionBooking = lazy(() => import('../pages/reception/ReceptionBooking'));
const ReceptionQueue = lazy(() => import('../pages/reception/ReceptionQueue'));
const ReceptionBilling = lazy(() => import('../pages/reception/ReceptionBilling'));
const ReceptionRegistration = lazy(() => import('../pages/reception/ReceptionRegistration'));
const ReceptionCheckin = lazy(() => import('../pages/reception/ReceptionCheckin'));
const ReceptionFeedback = lazy(() => import('../pages/reception/ReceptionFeedback'));

// ── Patient Pages
const PatientDashboard = lazy(() => import('../pages/patient/PatientDashboard'));
const PatientBook = lazy(() => import('../pages/patient/PatientBook'));
const PatientHistory = lazy(() => import('../pages/patient/PatientHistory'));
const PatientPrescriptions = lazy(() => import('../pages/patient/PatientPrescriptions'));
const PatientPayments = lazy(() => import('../pages/patient/PatientPayments'));
const PatientNotifications = lazy(() => import('../pages/patient/PatientNotifications'));
const PatientProfile = lazy(() => import('../pages/patient/PatientProfile'));
const PatientHealthTracker = lazy(() => import('../pages/patient/PatientHealthTracker'));
const PatientSymptomChecker = lazy(() => import('../pages/patient/PatientSymptomChecker'));

// Error Pages
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

// ─────────────────────────────────────────────────────────────────────────────
// Router Configuration
// ─────────────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: (
      <AuthInitializer>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AuthInitializer>
    ),
    children: [
      // ── Public / Guest Routes ──────────────────────────────────────────────
      {
        element: (
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        ),
        children: [
          { path: ROUTES.LOGIN, element: <Login /> },
          { path: ROUTES.REGISTER, element: <Register /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
        ],
      },

      // ── Protected Routes (Dashboard Layout) ────────────────────────────────
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          // Index route handles redirect in ProtectedRoute, or falls back here
          {
            path: '/',
            element: <Navigate to={ROUTES.LOGIN} replace />
          },

          // ── Admin Routes ───────────────────────────────────────────────────
          {
            path: ROUTES.ADMIN.ROOT,
            element: (
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> },
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'doctors', element: <AdminDoctors /> },
              { path: 'patients', element: <AdminPatients /> },
              { path: 'staff', element: <AdminStaff /> },
              { path: 'beds', element: <AdminBeds /> },
              { path: 'pharmacy', element: <AdminPharmacy /> },
              { path: 'revenue', element: <AdminRevenue /> },
              { path: 'reports', element: <AdminReports /> },
              { path: 'settings', element: <AdminSettings /> },
              { path: 'audit', element: <AdminAudit /> },
              { path: 'inventory', element: <AdminInventory /> },
              { path: '*', element: <NotFound /> },
            ],
          },

          // ── Doctor Routes ──────────────────────────────────────────────────
          {
            path: ROUTES.DOCTOR.ROOT,
            element: (
              <RoleGuard allowedRoles={[ROLES.DOCTOR]}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <Navigate to={ROUTES.DOCTOR.DASHBOARD} replace /> },
              { path: 'dashboard', element: <DoctorDashboard /> },
              { path: 'appointments', element: <DoctorAppointments /> },
              { path: 'records', element: <DoctorRecords /> },
              { path: 'prescriptions', element: <DoctorPrescriptions /> },
              { path: 'schedule', element: <DoctorSchedule /> },
              { path: 'notifications', element: <DoctorNotifications /> },
              { path: 'reviews', element: <DoctorReviews /> },
              { path: 'teleconsult', element: <DoctorTeleconsult /> },
              { path: 'ai-assistant', element: <DoctorAIAssistant /> },
              { path: 'analytics', element: <DoctorAnalytics /> },
              { path: '*', element: <NotFound /> },
            ],
          },

          // ── Receptionist Routes ────────────────────────────────────────────
          {
            path: ROUTES.RECEPTIONIST.ROOT,
            element: (
              <RoleGuard allowedRoles={[ROLES.RECEPTIONIST]}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <Navigate to={ROUTES.RECEPTIONIST.DASHBOARD} replace /> },
              { path: 'dashboard', element: <ReceptionDashboard /> },
              { path: 'booking', element: <ReceptionBooking /> },
              { path: 'queue', element: <ReceptionQueue /> },
              { path: 'billing', element: <ReceptionBilling /> },
              { path: 'registration', element: <ReceptionRegistration /> },
              { path: 'checkin', element: <ReceptionCheckin /> },
              { path: 'feedback', element: <ReceptionFeedback /> },
              { path: '*', element: <NotFound /> },
            ],
          },

          // ── Patient Routes ─────────────────────────────────────────────────
          {
            path: ROUTES.PATIENT.ROOT,
            element: (
              <RoleGuard allowedRoles={[ROLES.PATIENT]}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <Navigate to={ROUTES.PATIENT.DASHBOARD} replace /> },
              { path: 'dashboard', element: <PatientDashboard /> },
              { path: 'book', element: <PatientBook /> },
              { path: 'history', element: <PatientHistory /> },
              { path: 'prescriptions', element: <PatientPrescriptions /> },
              { path: 'payments', element: <PatientPayments /> },
              { path: 'notifications', element: <PatientNotifications /> },
              { path: 'profile', element: <PatientProfile /> },
              { path: 'health-tracker', element: <PatientHealthTracker /> },
              { path: 'symptom-checker', element: <PatientSymptomChecker /> },
              { path: '*', element: <NotFound /> },
            ],
          },
        ],
      },

      // ── Error Routes ───────────────────────────────────────────────────────
      {
        path: ROUTES.UNAUTHORIZED,
        element: <Unauthorized />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
