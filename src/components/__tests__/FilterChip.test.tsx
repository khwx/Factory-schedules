import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterChip from '../../components/FilterChip';

describe('FilterChip', () => {
    it('should render label', () => {
        render(<FilterChip label="Todos" />);
        expect(screen.getByText('Todos')).toBeInTheDocument();
    });

    it('should show count badge', () => {
        render(<FilterChip label="Teams" count={5} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const onClick = vi.fn();
        render(<FilterChip label="Active" active={false} onClick={onClick} />);
        fireEvent.click(screen.getByText('Active'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render with different colors', () => {
        const { container } = render(<FilterChip label="Red" color="red" active={true} />);
        expect(container.firstChild).toHaveClass('bg-red-600');
    });
});
