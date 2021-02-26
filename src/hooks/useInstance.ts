// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
import { useRef } from 'preact/hooks';

const UNINITIALIZED = Symbol('useInstance_uninitialized');

export const useInstance = <T extends unknown>(initialFunction: () => T): T => {
    const ref = useRef<T | typeof UNINITIALIZED>(UNINITIALIZED);

    if (ref.current === UNINITIALIZED) {
        ref.current = initialFunction();
    }

    return ref.current;
};
