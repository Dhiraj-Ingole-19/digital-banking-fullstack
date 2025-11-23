import { useEffect } from 'react';

export const useBackGuard = () => {
  useEffect(() => {
    const handlePop = () => {
      if (!window.confirm('Go back? You may be logged out.')) {
        window.history.pushState(null, null, window.location.pathname);
      }
    };
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);
};
