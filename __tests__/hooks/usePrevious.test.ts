import { usePrevious } from '@/hooks/index';
import { renderHook } from '@testing-library/react';

const setUp = () =>
    renderHook(({ state }: { state: number }) => usePrevious(state), {
        initialProps: { state: 0 },
    });

describe('usePrevious', () => {
    it('should return undefined on initial render', () => {
        const { result } = setUp();
        expect(result.current).toBeUndefined();
    });

    it('should always return previous state after update', () => {
        const { result, rerender } = setUp();
        rerender({ state: 1 });
        expect(result.current).toBe(0);
        rerender({ state: 2 });
        expect(result.current).toBe(1);
        rerender({ state: 3 });
        expect(result.current).toBe(2);
    });
});
