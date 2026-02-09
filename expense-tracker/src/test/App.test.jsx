import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Check for sidebar text
        expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
    });
});
