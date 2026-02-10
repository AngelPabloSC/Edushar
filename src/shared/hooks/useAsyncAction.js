import { useState, useCallback, useRef } from 'react';


export const useAsyncAction = (options = {}) => {
    const [isExecuting, setIsExecuting] = useState(false);
    const isExecutingRef = useRef(false);

    const execute = useCallback(async (asyncFn) => {
        // Prevenir ejecución si ya está en proceso
        if (isExecutingRef.current) {
            console.warn('⚠️ Action already in progress, ignoring duplicate call');
            return { prevented: true, success: false };
        }

        isExecutingRef.current = true;
        setIsExecuting(true);

        try {
            const result = await asyncFn();
            return { success: true, data: result, prevented: false };
        } catch (error) {
            console.error('❌ Async action error:', error);
            return { success: false, error, prevented: false };
        } finally {
            // Delay opcional antes de permitir nueva ejecución
            const delay = options.minDelay || 0;

            if (delay > 0) {
                setTimeout(() => {
                    isExecutingRef.current = false;
                    setIsExecuting(false);
                }, delay);
            } else {
                isExecutingRef.current = false;
                setIsExecuting(false);
            }
        }
    }, [options.minDelay]);

    return { isExecuting, execute };
};
