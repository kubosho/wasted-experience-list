import { StorageWrapper, createStorageWrapper } from './storageWrapper';

export function getSyncStorage(): StorageWrapper | null {
    const background = chrome.extension.getBackgroundPage();
    const syncStorage = background?.chrome.storage.sync;

    if (!syncStorage) {
        return null;
    }

    const storage = createStorageWrapper(syncStorage);

    return storage;
}
