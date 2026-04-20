// Initial state for DSA progress
export const initialDsaProgress = {
  xp: 0,
  level: 1,
  completedLevels: [],      // array of level IDs
  missionPerformance: {},   // { levelId: { attempts, breakthroughAttempt } }
  streakDays: 0,
  lastActiveDate: null,
};

export function userProgressReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_MISSION': {
      const { levelId, xpReward, attempts, breakthroughAttempt } = action.payload;
      const alreadyDone = state.completedLevels.includes(levelId);
      return {
        ...state,
        xp: alreadyDone ? state.xp : state.xp + xpReward,
        level: Math.floor((alreadyDone ? state.xp : state.xp + xpReward) / 100) + 1,
        completedLevels: alreadyDone ? state.completedLevels : [...state.completedLevels, levelId],
        missionPerformance: {
          ...state.missionPerformance,
          [levelId]: { attempts, breakthroughAttempt },
        },
        lastActiveDate: new Date().toDateString(),
      };
    }
    case 'HYDRATE':
      // Replace entire state with Firestore data (called on login)
      return { ...initialDsaProgress, ...action.payload };
    case 'RESET':
      return initialDsaProgress;
    default:
      return state;
  }
}
