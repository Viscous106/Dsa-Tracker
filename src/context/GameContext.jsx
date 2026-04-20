import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { userProgressReducer, initialDsaProgress } from '../reducers';

const GameContext = createContext(null);
const STORAGE_KEY = 'dsaveda_progress';

export function GameProvider({ children }) {
  const [progress, dispatch] = useReducer(userProgressReducer, initialDsaProgress, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const value = useMemo(() => ({ progress, dispatch }), [progress]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
