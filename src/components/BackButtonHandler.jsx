import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

/**
 * Component that handles Android hardware back button
 * Must be rendered inside Router context
 */
const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const historyStack = useRef([]);

  useEffect(() => {
    // Track navigation history
    historyStack.current.push(location.pathname);
    
    // Keep only the last 10 entries to prevent memory issues
    if (historyStack.current.length > 10) {
      historyStack.current = historyStack.current.slice(-10);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Only add listener if we're running in a Capacitor environment
    if (typeof window !== 'undefined' && window.Capacitor) {
      const handleBackButton = async () => {
        // Check if we can go back in the browser history
        if (window.history.length > 1) {
          // Define root routes that should exit the app
          const rootRoutes = ['/', '/demo', '/auth-demo','/bank/dashboard'];
          const isOnRootRoute = rootRoutes.includes(location.pathname);
          
          // Check if we're on a protected route (admin dashboard)
          const isOnProtectedRoute = location.pathname.startsWith('/dashboard') || 
                                   location.pathname.startsWith('/points-criteria') ||
                                   location.pathname.startsWith('/tiers') ||
                                   location.pathname.startsWith('/customers') ||
                                   location.pathname.startsWith('/users') ||
                                   location.pathname.startsWith('/role') ||
                                   location.pathname.startsWith('/khedma-offers') ||
                                   location.pathname.startsWith('/merchant-offers') ||
                                   location.pathname.startsWith('/system-logs') ||
                                   location.pathname.startsWith('/api-logs') ||
                                   location.pathname.startsWith('/apps') ||
                                   location.pathname.startsWith('/brands') ||
                                   location.pathname.startsWith('/payment-methods') ||
                                   location.pathname.startsWith('/categories') ||
                                   location.pathname.startsWith('/rules') ||
                                   location.pathname.startsWith('/reports') ||
                                   location.pathname.startsWith('/theme') ||
                                   location.pathname.startsWith('/trigger-events') ||
                                   location.pathname.startsWith('/trigger-services') ||
                                   location.pathname.startsWith('/auth-logs') ||
                                   location.pathname.startsWith('/sdk-access') ||
                                   location.pathname.startsWith('/support');
          
          if (isOnRootRoute) {
            // On root routes, exit the app
            await App.exitApp();
          } else if (isOnProtectedRoute && historyStack.current.length <= 2) {
            // If on protected route with minimal history, go to dashboard
            navigate('/dashboard');
          } else {
            // Navigate back in the app
            navigate(-1);
          }
        } else {
          // No history to go back to, exit the app
          await App.exitApp();
        }
      };

      // Add the back button listener
      App.addListener('backButton', handleBackButton);

      // Cleanup function to remove the listener
      return () => {
        App.removeAllListeners();
      };
    }
  }, [navigate, location.pathname]);

  // This component doesn't render anything, it just handles the back button
  return null;
};

export default BackButtonHandler;
