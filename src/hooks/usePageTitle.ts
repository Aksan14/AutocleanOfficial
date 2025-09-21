import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore previous title
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}