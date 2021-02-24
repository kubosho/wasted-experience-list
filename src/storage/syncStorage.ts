import { StorageWrapper, createStorageWrapper } from './storageWrapper';

export function getSyncStorage(): StorageWrapper {
    const syncStorage = chrome.storage.sync;
    const storage = createStorageWrapper(syncStorage);

    return storage;
}
