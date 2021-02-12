import { SECONDS } from '../time/time';
import { StorageWrapper, STORAGE_KEY } from '../storage/storageWrapper';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';
import { getTabData } from '../tab/tabData';
import { getSyncStorage } from '../storage/syncStorage';

class TimeTrackerOfSpentOnPage {
    private _storage: StorageWrapper;
    private _itemValueList: ItemValue[] | null;
    private _intervalId: number | null;

    constructor(storage: StorageWrapper) {
        this._storage = storage;
        this._itemValueList = null;
        this._intervalId = null;

        this._storage?.get<ItemValue[]>(STORAGE_KEY).then((valueList) => (this._itemValueList = valueList));
    }

    async track(tabId: number): Promise<void> {
        const tab = await getTabData(tabId);
        const pageUrl = tab.url;

        const index = this._itemValueList?.findIndex((itemValue) => itemValue.url === pageUrl) ?? -1;
        if (index < 0) {
            return;
        }

        this._intervalId = window.setInterval(() => {
            this._saveToStorage(index);
        }, SECONDS);
    }

    untrack(): void {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    private _saveToStorage(index: number): void {
        if (!this._itemValueList) {
            return;
        }

        const value = this._itemValueList[index];

        this._itemValueList[index] = createItemValue({ ...value, time: (value.time += SECONDS) });
        this._storage.set(STORAGE_KEY, this._itemValueList);
    }
}

export function createTimeTrackerOfSpentOnPage(): TimeTrackerOfSpentOnPage | null {
    const storage = getSyncStorage();

    if (!storage) {
        return null;
    }

    return new TimeTrackerOfSpentOnPage(storage);
}
