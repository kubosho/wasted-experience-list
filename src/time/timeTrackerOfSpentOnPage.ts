import { SECONDS } from '../time/time';
import { StorageWrapper, STORAGE_KEY } from '../storage/storageWrapper';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';
import { getSyncStorage } from '../storage/syncStorage';

export interface TimeTrackerOfSpentOnPage {
    itemValueList: ItemValue[] | null;

    track(pageUrl: string): void;
    autoTrack(pageUrl: string): void;
    stopAutoTrack(): void;
    saveToStorage(itemValueList: ItemValue[]): void;
}

class TimeTrackerOfSpentOnPageImpl implements TimeTrackerOfSpentOnPage {
    private _storage: StorageWrapper;
    private _intervalId: number | null;
    private _itemValueList: ItemValue[] | null;

    constructor(storage: StorageWrapper) {
        this._storage = storage;
        this._intervalId = null;
        this._itemValueList = null;

        this._storage?.get<ItemValue[]>(STORAGE_KEY).then((valueList) => {
            this._itemValueList = valueList;
        });
    }

    get itemValueList(): ItemValue[] | null {
        return this._itemValueList;
    }

    track(pageUrl: string): void {
        if (!this._itemValueList) {
            return;
        }

        const index = this._itemValueList.findIndex((itemValue) => itemValue.url === pageUrl);
        if (index < 0) {
            return;
        }

        const prevValue = this._itemValueList[index];
        const newValue = createItemValue({ ...prevValue, time: (prevValue.time += SECONDS) });
        const newList = replaceValueAtItemValueList(this._itemValueList, index, newValue);

        this._itemValueList = newList;
    }

    autoTrack(pageUrl: string): void {
        this._intervalId = window.setInterval(() => this.track(pageUrl), SECONDS);
    }

    stopAutoTrack(): void {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    saveToStorage(itemValueList: ItemValue[]): void {
        this._storage.set(STORAGE_KEY, itemValueList);
    }
}

function replaceValueAtItemValueList(baseList: ItemValue[], index: number, value: ItemValue): ItemValue[] {
    const newList = [...baseList];
    newList[index] = value;
    return newList;
}

export function createTimeTrackerOfSpentOnPage(storage?: StorageWrapper): TimeTrackerOfSpentOnPage | null {
    const s = storage ?? getSyncStorage();

    if (!s) {
        return null;
    }

    return new TimeTrackerOfSpentOnPageImpl(s);
}
