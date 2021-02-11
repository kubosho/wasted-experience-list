import { ExtensionSyncStorageLike } from './extensionSyncStorageLike';

export const STORAGE_KEY = 'wasted_experience_list';

export interface StorageWrapper {
    get: <T>(key: string) => Promise<T>;
    set: <T>(key: string, value: T) => Promise<void>;
    remove: (key: string) => Promise<void>;
}

class StorageWrapperImpl {
    private _storage: ExtensionSyncStorageLike;

    constructor(storage: ExtensionSyncStorageLike) {
        this._storage = storage;
    }

    get<T>(key: string): Promise<T> {
        return new Promise((resolve) => this._storage.get<T>((items) => resolve(items[key])));
    }

    set<T>(key: string, value: T): Promise<void> {
        return new Promise((resolve) => this._storage.set({ [key]: value }, resolve));
    }

    remove(key: string | string[]): Promise<void> {
        return new Promise((resolve) => this._storage.remove(key, resolve));
    }
}

export function createStorageWrapper(storage: ExtensionSyncStorageLike): StorageWrapper {
    return new StorageWrapperImpl(storage);
}
