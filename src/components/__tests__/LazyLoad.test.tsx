import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { lazy as reactLazy } from 'react';
import LazyLoad, { lazyLoad } from '../LazyLoad';

describe('LazyLoad', () => {
    it('renders children immediately', () => {
        render(
            <LazyLoad>
                <span>Loaded content</span>
            </LazyLoad>
        );
        expect(screen.getByText('Loaded content')).toBeInTheDocument();
    });

    it('uses a custom fallback while a lazy child suspends', () => {
        const fallback = <div>Custom fallback</div>;
        const Suspended = reactLazy(() => new Promise<{ default: React.FC }>(() => {}));
        render(
            <LazyLoad fallback={fallback}>
                <Suspended />
            </LazyLoad>
        );
        expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('exposes a lazyLoad factory that returns a lazy component', () => {
        const Comp = lazyLoad(async () => ({ default: () => <div>Lazy</div> }));
        expect(typeof Comp).toBe('object');
        expect(Comp.$$typeof).toBe(Symbol.for('react.lazy'));
    });
});
