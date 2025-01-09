import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
} as Storage;
global.localStorage = localStorageMock;

// Mock Web Audio API
class AudioContextMock {
    createOscillator() {
        return {
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            disconnect: vi.fn(),
            type: 'sine',
            frequency: {
                setValueAtTime: vi.fn(),
            },
        };
    }
    createGain() {
        return {
            connect: vi.fn(),
            disconnect: vi.fn(),
            gain: {
                setValueAtTime: vi.fn(),
                linearRampToValueAtTime: vi.fn(),
            },
        };
    }
    destination: AudioDestinationNode;
    state: string;
    resume: () => Promise<void>;
    close: () => void;

    constructor() {
        this.state = 'running';
        this.resume = vi.fn().mockResolvedValue(undefined);
        this.close = vi.fn();
        this.destination = {} as AudioDestinationNode;
    }
}

global.AudioContext = AudioContextMock as any; 