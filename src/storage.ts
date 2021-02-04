import { DOMStorageLike } from './domStorageLike';

export const STORAGE_KEY = 'wasted_experience_list';

export function createStorageWrapper(): DOMStorageLike {
    return window.localStorage;
}
