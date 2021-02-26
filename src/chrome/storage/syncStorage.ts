import { StorageWrapper, createStorageWrapper } from '../../storage/storageWrapper';

export function getSyncStorage(): StorageWrapper {
    const syncStorage = chrome.storage.sync;
    const storage = createStorageWrapper(syncStorage);

    return storage;
}
