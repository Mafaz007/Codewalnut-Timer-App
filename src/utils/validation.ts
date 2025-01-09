import { toast } from 'sonner';

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;

  if (!title.trim()) {
    toast.error('Title is required');
    return false;
  }

  if (title.length > 50) {
    toast.error('Title must be less than 50 characters');
    return false;
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    toast.error('Time values cannot be negative');
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    toast.error('Minutes and seconds must be between 0 and 59');
    return false;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    toast.error('Please set a time greater than 0');
    return false;
  }

  if (totalSeconds > 86400) { // 24 hours
    toast.error('Timer cannot exceed 24 hours');
    return false;
  }

  return true;
};

// Unit Tests
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;

  vi.mock('sonner', () => ({
    toast: {
      error: vi.fn(),
    },
  }));

  describe('validateTimerForm', () => {
    let validFormData: TimerFormData;

    beforeEach(() => {
      vi.clearAllMocks();
      validFormData = {
        title: 'Test Timer',
        description: 'Test Description',
        hours: 1,
        minutes: 30,
        seconds: 0,
      };
    });

    it('should validate valid form data', () => {
      expect(validateTimerForm(validFormData)).toBe(true);
    });

    it('should validate title requirements', () => {
      // Empty title
      expect(validateTimerForm({ ...validFormData, title: '' })).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Title is required');

      // Title too long
      expect(validateTimerForm({
        ...validFormData,
        title: 'A'.repeat(51)
      })).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Title must be less than 50 characters');
    });

    it('should validate time constraints', () => {
      // Negative values
      expect(validateTimerForm({ ...validFormData, hours: -1 })).toBe(false);
      expect(validateTimerForm({ ...validFormData, minutes: -1 })).toBe(false);
      expect(validateTimerForm({ ...validFormData, seconds: -1 })).toBe(false);

      // Invalid minutes/seconds
      expect(validateTimerForm({ ...validFormData, minutes: 60 })).toBe(false);
      expect(validateTimerForm({ ...validFormData, seconds: 60 })).toBe(false);

      // Zero duration
      expect(validateTimerForm({
        ...validFormData,
        hours: 0,
        minutes: 0,
        seconds: 0
      })).toBe(false);

      // Exceeds 24 hours
      expect(validateTimerForm({ ...validFormData, hours: 25 })).toBe(false);
    });

    it('should validate edge cases', () => {
      // Exactly 24 hours
      expect(validateTimerForm({
        ...validFormData,
        hours: 24,
        minutes: 0,
        seconds: 0,
      })).toBe(true);

      // Minimum valid time (1 second)
      expect(validateTimerForm({
        ...validFormData,
        hours: 0,
        minutes: 0,
        seconds: 1,
      })).toBe(true);
    });
  });
}