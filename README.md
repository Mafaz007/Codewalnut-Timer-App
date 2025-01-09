# Timer App

A React-based timer application that allows users to create, manage, and run multiple timers simultaneously.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mafaz007/Codewalnut-Timer-App.git
   cd timer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## Enhancements Made

### 1. State Management
- Implemented Redux Toolkit for centralized state management
- Added localStorage persistence for timers
- Enabled real-time synchronization across browser tabs

### 2. UI/UX Improvements
- Matched UI with provided screenshots
- Added responsive design for mobile and desktop views
- Implemented snackbar notifications with different positions based on device type
  - Desktop: Top-right corner
  - Mobile: Bottom of screen

### 3. Timer Functionality
- Enabled multiple simultaneous timers
- Added persistent audio notifications until dismissed
- Implemented timer restart functionality
- Added edit capability for existing timers

### 4. Code Quality
- Extracted reusable components (ModalButton, TimerControls)
- Consolidated modal logic into a single TimerFormModal component
- Added comprehensive TypeScript types
- Implemented proper error handling

### 5. Testing
- Added unit tests for validation logic
- Implemented component tests for TimerItem
- Added test coverage for audio functionality
- Included mock implementations for complex features

### 6. Error Handling
- Added form validation with user feedback
- Resolved snackbar console errors
- Implemented graceful error handling for audio playback
- Added validation toast messages

### 7. Performance Optimizations
- Implemented proper cleanup for intervals and audio
- Added efficient state updates
- Optimized re-renders using proper React patterns

## Additional Features
- Audio feedback for timer completion
- Progress indicator for running timers
- Responsive grid layout for timer display
- Keyboard accessibility improvements
- Clear all timers functionality
- Cross-tab synchronization

## Tech Stack
- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vitest
- React Testing Library