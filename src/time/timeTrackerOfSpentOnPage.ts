import { SECONDS } from '../time/time';
import { StorageWrapper, STORAGE_KEY } from '../storage/storageWrapper';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';
import { getTabData } from '../tab/tabData';
import { getSyncStorage } from '../storage/syncStorage';

class TimeTrackerOfSpentOnPage {
    private _storage: StorageWrapper;
    private _intervalId: number | null;

    constructor(storage: StorageWrapper) {
        this._storage = storage;
        this._intervalId = null;
    }

    async track(tabId: number): Promise<void> {
        const tab = await getTabData(tabId);
        const pageUrl = tab.url;

        this._intervalId = window.setInterval(async () => {
            const itemValueList = await this._storage?.get<ItemValue[]>(STORAGE_KEY);
            const index = itemValueList.findIndex((itemValue) => itemValue.url === pageUrl);

            if (index < 0) {
                return;
            }

            this._saveToStorage(itemValueList, index);
        }, SECONDS);
    }

    untrack(): void {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    private async _saveToStorage(itemValueList: ItemValue[], index: number): Promise<void> {
        const value = itemValueList[index];

        itemValueList[index] = createItemValue({ ...value, time: (value.time += SECONDS) });
        this._storage.set(STORAGE_KEY, itemValueList);
    }
}

export function createTimeTrackerOfSpentOnPage(): TimeTrackerOfSpentOnPage | null {
    const storage = getSyncStorage();

    if (!storage) {
        return null;
    }

    return new TimeTrackerOfSpentOnPage(storage);
}
