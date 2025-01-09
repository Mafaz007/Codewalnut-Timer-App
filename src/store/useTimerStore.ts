import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';

const STORAGE_KEY = 'timers';

const loadTimers = (): Timer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading timers from localStorage:', error);
    return [];
  }
};

const initialState = {
  timers: loadTimers(),
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timers));
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(timer => timer.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timers));
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timers));
      }
    },
    updateTimer: (state) => {
      state.timers.forEach(timer => {
        if (timer.isRunning && timer.remainingTime > 0) {
          timer.remainingTime -= 1;
          timer.isRunning = timer.remainingTime > 0;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timers));
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timers));
      }
    },
    editTimer: (state, action: PayloadAction<{ id: string; updates: Partial<Timer> }>) => {
      const timer = state.timers.find(timer => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timers));
      }
    },
  },
});

export const store = configureStore({
  reducer: timerSlice.reducer,
});

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: () => dispatch(updateTimer()),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};