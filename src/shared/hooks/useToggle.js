import { useState, useCallback } from 'react';

/**
 * Custom hook for simple boolean toggle state
 * @param {boolean} initialValue - Initial state value
 * @returns {[boolean, () => void]} Tuple of [value, toggle function]
 */
export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(v => !v);
    }, []);

    return [value, toggle];
}
