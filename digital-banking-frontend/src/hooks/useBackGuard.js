import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBackGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Push an initial state to create a history entry
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event) => {
      // Always push state back immediately to maintain the guard
      window.history.pushState(null, '', window.location.href);
      
      // Show confirmation dialog
      const userConfirmed = window.confirm(
        'Are you sure you want to go back? You will be logged out for security reasons.'
      );

      if (userConfirmed) {
        // User wants to go back - navigate to login
        navigate('/login', { replace: true });
      }
      // If user cancels, we've already pushed state back, so they stay on the page
    };

    // Listen for back button
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
};
