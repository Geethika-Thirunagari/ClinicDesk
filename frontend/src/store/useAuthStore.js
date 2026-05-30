import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stopAllSessionMedia } from '../utils/stopAllMedia';

/**
 * User roles supported by ClinicDesk.
 * Used by route guards to enforce role-based access control.
 */
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient',
};

/**
 * Role-to-default-dashboard path map.
 * After login, users are redirected here based on their role.
 */
export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.DOCTOR]: '/doctor/dashboard',
  [ROLES.RECEPTIONIST]: '/reception/dashboard',
  [ROLES.PATIENT]: '/patient/dashboard',
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: null,           // { id, name, email, role, avatar? }
      token: null,
      isAuthenticated: false,
      isLoading: true,      // true while hydrating from storage on app boot

      // ── Derived helpers ────────────────────────────────────────────────────
      /** Returns the role string (admin | doctor | patient | null) */
      getRole: () => get().user?.role ?? null,

      /** Returns true if the current user's role matches any of the given roles */
      hasRole: (...roles) => roles.includes(get().user?.role),

      /** Home path based on current role */
      getHome: () => ROLE_HOME[get().user?.role] ?? '/',

      // ── Actions ────────────────────────────────────────────────────────────
      /**
       * Call after a successful API login.
       * @param {{ id, name, email, role, avatar? }} userData
       * @param {string} token  JWT access token
       */
      login: (userData, token) => {
        set({ user: userData, token, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        stopAllSessionMedia();
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
        }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      /** Used by AuthInitializer on app boot to finish the hydration phase. */
      setLoading: (loading) => set({ isLoading: loading }),

      /** Patch user fields (e.g. after profile update). */
      updateUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
    }),
    {
      name: 'clinicdesk-auth',   // localStorage key
      partialize: (s) => ({      // only persist these fields
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
