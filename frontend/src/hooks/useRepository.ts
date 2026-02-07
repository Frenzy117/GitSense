import { useState, useCallback } from 'react';

export const useRepository = (initialRepo: string = '') => {
  const [activeRepo, setActiveRepo] = useState(initialRepo);

  const selectRepo = useCallback((repoName: string) => {
    setActiveRepo(repoName);
  }, []);

  return {
    activeRepo,
    selectRepo
  };
};
