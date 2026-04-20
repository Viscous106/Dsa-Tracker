/**
 * useProgress.js
 *
 * Computes derived statistics from the raw game progress state.
 * Centralises all progress-calculation logic that was duplicated
 * across Home, Dashboard, and Profile pages.
 *
 * Demonstrates: useMemo (memoised derived state), custom hook composition
 */

import { useMemo } from 'react';
import { useGame } from '../context';
import dsaLevels from '../data/levels';

const TOTAL_LEVELS = dsaLevels.length;

const RANK_THRESHOLDS = [
  { min: 2000, label: '👑 Master'    },
  { min: 1000, label: '💎 Expert'    },
  { min: 500,  label: '🥇 Specialist'},
  { min: 200,  label: '🥈 Initiate'  },
  { min: 0,    label: '🥉 Recruit'   },
];

/**
 * Returns memoised progress stats derived from GameContext.
 * Only re-computes when `progress` actually changes.
 */
export function useProgress() {
  const { progress, dispatch } = useGame();

  const stats = useMemo(() => {
    const completedCount = progress.completedLevels.length;
    const pct            = TOTAL_LEVELS > 0
      ? Math.round((completedCount / TOTAL_LEVELS) * 100)
      : 0;

    // XP level (every 100 XP = 1 level)
    const currentLevel = Math.floor(progress.xp / 100) + 1;
    const xpIntoLevel  = progress.xp % 100;
    const xpToNext     = 100 - xpIntoLevel;

    // Rank label
    const rank = RANK_THRESHOLDS.find((t) => progress.xp >= t.min)?.label
      ?? '🥉 Recruit';

    // Next unlocked level
    const nextLevel = dsaLevels.find(
      (l) => !progress.completedLevels.includes(l.id),
    ) ?? null;

    // Recent sessions (last 8, newest first)
    const sessionHistory = Object.entries(progress.missionPerformance)
      .map(([id, perf]) => {
        const lv = dsaLevels.find((l) => l.id === parseInt(id, 10));
        return lv ? { ...lv, ...perf } : null;
      })
      .filter(Boolean)
      .reverse()
      .slice(0, 8);

    return {
      completedCount,
      totalLevels: TOTAL_LEVELS,
      pct,
      currentLevel,
      xpIntoLevel,
      xpToNext,
      rank,
      nextLevel,
      sessionHistory,
    };
  }, [progress]);

  return { progress, dispatch, ...stats };
}
