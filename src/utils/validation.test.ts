import { validateTimerForm } from './validation';
import { toast } from 'sonner';

// Mock sonner toast
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
    },
}));

describe('validateTimerForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true for valid timer data', () => {
        const validData = {
            title: 'Test Timer',
            description: 'Test Description',
            hours: 1,
            minutes: 30,
            seconds: 45,
        };

        const result = validateTimerForm(validData);
        expect(result).toBe(true);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('should validate empty title', () => {
        const data = {
            title: '   ',
            description: 'Test',
            hours: 1,
            minutes: 0,
            seconds: 0,
        };

        const result = validateTimerForm(data);
        expect(result).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Title is required');
    });

    it('should validate title length', () => {
        const data = {
            title: 'a'.repeat(51),
            description: 'Test',
            hours: 1,
            minutes: 0,
            seconds: 0,
        };

        const result = validateTimerForm(data);
        expect(result).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Title must be less than 50 characters');
    });

    it('should validate negative time values', () => {
        const data = {
            title: 'Test',
            description: 'Test',
            hours: -1,
            minutes: 0,
            seconds: 0,
        };

        const result = validateTimerForm(data);
        expect(result).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
    });

    it('should validate minutes and seconds range', () => {
        const data = {
            title: 'Test',
            description: 'Test',
            hours: 1,
            minutes: 60,
            seconds: 0,
        };

        const result = validateTimerForm(data);
        expect(result).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
    });

    it('should validate zero duration', () => {
        const data = {
            title: 'Test',
            description: 'Test',
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        const result = validateTimerForm(data);
        expect(result).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Please set a time greater than 0');
    });

    it('should validate maximum duration (24 hours)', () => {
        const data = {
            title: 'Test',
            description: 'Test',
            hours: 25,
            minutes: 0,
            seconds: 0,
        };

        const result = validateTimerForm(data);
        expect(result).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Timer cannot exceed 24 hours');
    });
});
