import { render, screen, fireEvent } from '@testing-library/react';
import AdminUI from '../../../src/admin/admin.js'; // Adjust the import based on your actual component structure

describe('Admin UI', () => {
    beforeEach(() => {
        render(<AdminUI />);
    });

    test('renders admin panel title', () => {
        const titleElement = screen.getByText(/Admin Panel/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('displays access code input', () => {
        const inputElement = screen.getByLabelText(/Access Code/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('allows input of access code', () => {
        const inputElement = screen.getByLabelText(/Access Code/i);
        fireEvent.change(inputElement, { target: { value: 'test-code' } });
        expect(inputElement.value).toBe('test-code');
    });

    test('submits access code', () => {
        const inputElement = screen.getByLabelText(/Access Code/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        fireEvent.change(inputElement, { target: { value: 'test-code' } });
        fireEvent.click(submitButton);

        // Add assertions to verify the expected behavior after submission
        const successMessage = screen.getByText(/Access granted/i);
        expect(successMessage).toBeInTheDocument();
    });

    test('shows error message for invalid access code', () => {
        const inputElement = screen.getByLabelText(/Access Code/i);
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        fireEvent.change(inputElement, { target: { value: 'invalid-code' } });
        fireEvent.click(submitButton);

        const errorMessage = screen.getByText(/Access denied/i);
        expect(errorMessage).toBeInTheDocument();
    });
});