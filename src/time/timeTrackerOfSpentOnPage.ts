import { SECONDS } from '../time/time';
import { StorageWrapper, STORAGE_KEY } from '../storage/storageWrapper';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';
import { getSyncStorage } from '../storage/syncStorage';

export interface TimeTrackerOfSpentOnPage {
    itemValueList: ItemValue[] | null;

    track(
        pageUrl: string,
        callback?: (prevValue: ItemValue | null, value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void;
    startAutoTrack(
        pageUrl: string,
        callback?: (prevValue: ItemValue | null, value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void;
    stopAutoTrack(
        callback?: (prevValue: ItemValue | null, value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void;
    saveToStorage(itemValueList: ItemValue[]): void;
}

class TimeTrackerOfSpentOnPageImpl implements TimeTrackerOfSpentOnPage {
    private _storage: StorageWrapper;
    private _intervalId: number | null;
    private _prevItemValue: ItemValue | null;
    private _itemValue: ItemValue | null;
    private _itemValueList: ItemValue[] | null;

    constructor(storage: StorageWrapper) {
        this._storage = storage;
        this._intervalId = null;

        this._prevItemValue = null;
        this._itemValue = null;
        this._itemValueList = null;

        this._storage?.get<ItemValue[]>(STORAGE_KEY).then((valueList) => {
            this._itemValueList = valueList;
        });
    }

    get itemValueList(): ItemValue[] | null {
        return this._itemValueList;
    }

    track(
        pageUrl: string,
        callback?: (prevValue: ItemValue | null, value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void {
        if (!this._itemValueList) {
            return;
        }

        const index = this._itemValueList.findIndex((itemValue) => itemValue.url === pageUrl);
        if (index < 0) {
            return;
        }

        this._prevItemValue = this._itemValueList[index];
        this._itemValue = createItemValue({ ...this._prevItemValue, time: (this._prevItemValue.time += SECONDS) });
        this._itemValueList = replaceValueAtItemValueList(this._itemValueList, index, this._itemValue);

        callback && callback(this._prevItemValue, this._itemValue, this._itemValueList);
    }

    startAutoTrack(
        pageUrl: string,
        callback?: (prevValue: ItemValue | null, value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void {
        const startAutoTrack = (): void => {
            this.track(pageUrl, callback);
            this._intervalId = window.setTimeout(startAutoTrack, SECONDS);
        };

        startAutoTrack();
    }

    stopAutoTrack(
        callback?: (prevValue: ItemValue | null, value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void {
        if (this._intervalId !== null) {
            clearTimeout(this._intervalId);
            this._intervalId = null;
            callback && callback(this._prevItemValue, this._itemValue, this._itemValueList);
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
