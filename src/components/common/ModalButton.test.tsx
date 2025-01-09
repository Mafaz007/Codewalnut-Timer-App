import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalButton } from './ModalButton';

describe('ModalButton', () => {
    it('renders with primary variant by default', () => {
        render(<ModalButton>Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        expect(button).toHaveClass('bg-blue-600');
        expect(button).toHaveClass('text-white');
    });

    it('renders with secondary variant when specified', () => {
        render(<ModalButton variant="secondary">Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        expect(button).toHaveClass('bg-gray-100');
        expect(button).toHaveClass('text-gray-700');
    });

    it('applies disabled styles when disabled', () => {
        render(<ModalButton disabled>Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        expect(button).toBeDisabled();
        expect(button).toHaveClass('bg-blue-400');
        expect(button).toHaveClass('cursor-not-allowed');
    });

    it('merges additional className prop', () => {
        render(<ModalButton className="custom-class">Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        expect(button).toHaveClass('custom-class');
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<ModalButton onClick={handleClick}>Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click handler when disabled', () => {
        const handleClick = vi.fn();
        render(<ModalButton disabled onClick={handleClick}>Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('passes through additional HTML button attributes', () => {
        render(<ModalButton type="submit" data-testid="test-button">Submit</ModalButton>);
        const button = screen.getByTestId('test-button');

        expect(button).toHaveAttribute('type', 'submit');
    });

    it('applies hover styles correctly', () => {
        render(<ModalButton>Click me</ModalButton>);
        const button = screen.getByRole('button', { name: /click me/i });

        expect(button).toHaveClass('hover:bg-blue-700');
    });
});
