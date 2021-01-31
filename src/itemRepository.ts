import { DOMStorageLike } from './domStorageLike';

export interface ItemRepository {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    getMap<T>(key: string): Map<string, T> | null;
    setMap<T>(key: string, value: T): void;
}

class ItemRepositoryImpl implements ItemRepository {
    private _storage: DOMStorageLike;

    constructor(s: DOMStorageLike) {
        this._storage = s;
    }

    get<T>(key: string): T | null {
        const raw = this._storage.getItem(key);

        if (raw === null) {
            return raw;
        }

        return JSON.parse(raw);
    }

    getMap<T>(key: string): Map<string, T> | null {
        const mapLikeObject = this.get(key);

        if (!Array.isArray(mapLikeObject)) {
            return null;
        }

        return new Map(mapLikeObject);
    }

    set<T>(key: string, value: T): void {
        const raw = value;
        this._storage.setItem(key, JSON.stringify(raw instanceof Map ? [...raw] : raw));
    }

    setMap<T>(key: string, value: T): void {
        if (!(value instanceof Map)) {
            throw new TypeError('value is not Map object.');
        }

        const raw = [...value];
        this.set(key, raw);
    }
}

export const createItemRepository = (storage: DOMStorageLike): ItemRepository => {
    return new ItemRepositoryImpl(storage);
};
