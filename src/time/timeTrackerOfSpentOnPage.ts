import { SECONDS } from '../time/time';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';

export interface TimeTrackerOfSpentOnPage {
    setItemValueList(itemValueList: ItemValue[]): void;
    track(pageUrl: string | null, callback?: (value: ItemValue, itemValueList: ItemValue[]) => void): void;
    startAutoTrack(pageUrl: string | null, callback?: (value: ItemValue, itemValueList: ItemValue[]) => void): void;
    stopAutoTrack(callback?: () => void): void;
}

class TimeTrackerOfSpentOnPageImpl implements TimeTrackerOfSpentOnPage {
    private _intervalId: number | null;
    private _itemValueList: ItemValue[] | null;

    constructor() {
        this._intervalId = null;
        this._itemValueList = null;
    }

    setItemValueList(itemValueList: ItemValue[]): void {
        this._itemValueList = itemValueList;
    }

    track(pageUrl: string | null, callback?: (value: ItemValue, itemValueList: ItemValue[]) => void): void {
        if (!pageUrl || pageUrl === '' || !this._itemValueList || this._itemValueList.length === 0) {
            return;
        }

        const index = this._itemValueList?.findIndex((itemValue) => itemValue.url === pageUrl);
        if (index < 0) {
            return;
        }

        const prevItemValue = this._itemValueList[index];
        const itemValue = createItemValue({ ...prevItemValue, time: (prevItemValue.time += SECONDS) });
        const newItemValueList = replaceValueAtItemValueList(this._itemValueList, index, itemValue);

        callback && callback(itemValue, newItemValueList);
    }

    startAutoTrack(pageUrl: string | null, callback?: (value: ItemValue, itemValueList: ItemValue[]) => void): void {
        if (!pageUrl || pageUrl === '') {
            return;
        }

        const startAutoTrack = (): void => {
            this.track(pageUrl, callback);
            this._intervalId = window.setTimeout(startAutoTrack, SECONDS);
        };

        startAutoTrack();
    }

    stopAutoTrack(callback?: () => void): void {
        if (this._intervalId !== null) {
            clearTimeout(this._intervalId);
            this._intervalId = null;
            callback && callback();
        }
    }
}

function replaceValueAtItemValueList(baseList: ItemValue[], index: number, value: ItemValue): ItemValue[] {
    const newList = [...baseList];
    newList[index] = value;
    return newList;
}

export function createTimeTrackerOfSpentOnPage(): TimeTrackerOfSpentOnPage {
    return new TimeTrackerOfSpentOnPageImpl();
}
