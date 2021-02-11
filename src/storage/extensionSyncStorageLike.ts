export interface ExtensionSyncStorageLike {
    get<T>(callback: (items: { [key: string]: T }) => void): void;
    set<T>(items: T, callback?: () => void): void;
    remove(keys: string | string[], callback?: () => void): void;
}
