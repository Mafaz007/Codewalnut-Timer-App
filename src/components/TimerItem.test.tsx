import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimerItem } from './TimerItem';
import { useTimerStore } from '../store/useTimerStore';
import { Timer } from '../types/timer';
import { TimerAudio } from '../utils/audio';

// Mock the store
jest.mock('../store/useTimerStore');
const mockUseTimerStore = useTimerStore as jest.MockedFunction<typeof useTimerStore>;

// Mock the audio
jest.mock('../utils/audio', () => ({
    TimerAudio: {
        getInstance: jest.fn(() => ({
            play: jest.fn().mockResolvedValue(undefined),
            stop: jest.fn(),
        })),
    },
}));

// Mock toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        dismiss: jest.fn(),
    },
}));

describe('TimerItem', () => {
    const mockTimer: Timer = {
        id: '1',
        title: 'Test Timer',
        description: 'Test Description',
        duration: 60,
        remainingTime: 60,
        isRunning: false,
        createdAt: Date.now()
    };

    const mockStoreFunctions = {
        timers: [],
        addTimer: jest.fn(),
        toggleTimer: jest.fn(),
        deleteTimer: jest.fn(),
        updateTimer: jest.fn(),
        restartTimer: jest.fn(),
        editTimer: jest.fn(),
        clearTimers: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTimerStore.mockReturnValue(mockStoreFunctions);
    });

    it('renders timer information correctly', () => {
        render(<TimerItem timer={mockTimer} />);

        expect(screen.getByText('Test Timer')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('00:01:00')).toBeInTheDocument();
    });

    it('handles timer controls correctly', () => {
        render(<TimerItem timer={mockTimer} />);

        const playButton = screen.getByTitle('Start Timer');
        fireEvent.click(playButton);
        expect(mockStoreFunctions.toggleTimer).toHaveBeenCalledWith('1');

        const restartButton = screen.getByTitle('Restart Timer');
        fireEvent.click(restartButton);
        expect(mockStoreFunctions.restartTimer).toHaveBeenCalledWith('1');

        const deleteButton = screen.getByTitle('Delete Timer');
        fireEvent.click(deleteButton);
        expect(mockStoreFunctions.deleteTimer).toHaveBeenCalledWith('1');
    });

    it('opens edit modal when edit button is clicked', () => {
        render(<TimerItem timer={mockTimer} />);

        const editButton = screen.getByTitle('Edit Timer');
        fireEvent.click(editButton);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('updates timer and plays sound when timer ends', () => {
        jest.useFakeTimers();

        const runningTimer = {
            ...mockTimer,
            isRunning: true,
            remainingTime: 1,
        };

        render(<TimerItem timer={runningTimer} />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(mockStoreFunctions.updateTimer).toHaveBeenCalled();
        expect(TimerAudio.getInstance().play).toHaveBeenCalled();

        jest.useRealTimers();
    });

    it('cleans up interval on unmount', () => {
        const runningTimer = {
            ...mockTimer,
            isRunning: true,
        };

        jest.useFakeTimers();
        const { unmount } = render(<TimerItem timer={runningTimer} />);

        unmount();

        // Ensure the interval is cleared
        expect(jest.getTimerCount()).toBe(0);

        jest.useRealTimers();
    });

    it('handles accepting timer edits', () => {
        render(<TimerItem timer={mockTimer} />);

        // Open edit modal
        const editButton = screen.getByTitle('Edit Timer');
        fireEvent.click(editButton);

        // Fill in new values
        const titleInput = screen.getByLabelText('Title');
        const descriptionInput = screen.getByLabelText('Description');
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
        fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

        // Accept changes
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        expect(mockStoreFunctions.editTimer).toHaveBeenCalledWith('1', {
            title: 'Updated Title',
            description: 'Updated Description',
            duration: 60
        });
    });

    it('handles rejecting timer edits', () => {
        render(<TimerItem timer={mockTimer} />);

        // Open edit modal
        const editButton = screen.getByTitle('Edit Timer');
        fireEvent.click(editButton);

        // Fill in values that should be discarded
        const titleInput = screen.getByLabelText('Title');
        fireEvent.change(titleInput, { target: { value: 'Should Not Save' } });

        // Cancel edit
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        // Verify edit function was not called
        expect(mockStoreFunctions.editTimer).not.toHaveBeenCalled();

        // Verify modal is closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
