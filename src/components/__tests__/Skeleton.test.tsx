import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton, ScenarioCardSkeleton, TableSkeleton, ChartSkeleton } from '../Skeleton';

describe('Skeleton', () => {
    it('should render one skeleton by default', () => {
        const { container } = render(<Skeleton />);
        expect(container.querySelectorAll('div.animate-pulse').length).toBe(1);
    });

    it('should render the requested count', () => {
        const { container } = render(<Skeleton count={4} />);
        expect(container.querySelectorAll('div.animate-pulse').length).toBe(4);
    });

    it('should apply custom className', () => {
        const { container } = render(<Skeleton className="h-20 w-10" />);
        const el = container.querySelector('div.animate-pulse');
        expect(el?.className).toContain('h-20');
        expect(el?.className).toContain('w-10');
    });

    it('should be aria-hidden', () => {
        const { container } = render(<Skeleton />);
        expect(container.querySelector('div.animate-pulse')).toHaveAttribute('aria-hidden', 'true');
    });
});

describe('ScenarioCardSkeleton', () => {
    it('should render skeleton structure', () => {
        const { container } = render(<ScenarioCardSkeleton />);
        expect(container.querySelectorAll('div.animate-pulse').length).toBeGreaterThan(5);
    });
});

describe('TableSkeleton', () => {
    it('should render rows x cols skeletons plus header', () => {
        const { container } = render(<TableSkeleton rows={3} cols={2} />);
        expect(container.querySelectorAll('div.animate-pulse').length).toBe(3 * 2 + 2);
    });
});

describe('ChartSkeleton', () => {
    it('should render chart skeleton', () => {
        const { container } = render(<ChartSkeleton />);
        expect(container.querySelectorAll('div.animate-pulse').length).toBe(2);
    });
});