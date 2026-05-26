import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * AuthInitializer
 * Runs once on app mount. Validates the persisted token against the API
 * and either keeps the session alive or clears stale auth state.
 *
 * Place this at the top of your component tree, just inside <RouterProvider>.
 */
const AuthInitializer = ({ children }) => {
  const { token, logout, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      if (!token || !isAuthenticated) {
        // No token stored — nothing to validate
        setLoading(false);
        return;
      }

      try {
        // TODO: swap for your real /auth/me endpoint
        // const res = await authService.me();
        // updateUser(res.data);
        //
        // For now we just trust the persisted state and clear the loading flag.
        setLoading(false);
      } catch {
        // Token is expired / revoked — force logout
        logout();
        setLoading(false);
      }
    };

    bootstrap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default AuthInitializer;
