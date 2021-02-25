import { SECONDS } from '../time/time';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';

export interface TimeTrackerOfSpentOnPage {
    track(
        pageUrl: string,
        itemValueList: ItemValue[],
        callback?: (value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void;
    startAutoTrack(
        pageUrl: string,
        itemValueList: ItemValue[],
        callback?: (value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void;
    stopAutoTrack(callback?: () => void): void;
}

class TimeTrackerOfSpentOnPageImpl implements TimeTrackerOfSpentOnPage {
    private _intervalId: number | null;

    constructor() {
        this._intervalId = null;
    }

    track(
        pageUrl: string,
        itemValueList: ItemValue[],
        callback?: (value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void {
        if (pageUrl === '' || itemValueList.length === 0) {
            return;
        }

        const index = itemValueList.findIndex((itemValue) => itemValue.url === pageUrl);
        if (index < 0) {
            return;
        }

        const prevItemValue = itemValueList[index];
        const itemValue = createItemValue({ ...prevItemValue, time: (prevItemValue.time += SECONDS) });
        const newItemValueList = replaceValueAtItemValueList(itemValueList, index, itemValue);

        callback && callback(itemValue, newItemValueList);
    }

    startAutoTrack(
        pageUrl: string,
        itemValueList: ItemValue[],
        callback?: (value: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): void {
        if (pageUrl === '') {
            return;
        }

        this._intervalId = window.setInterval(() => this.track(pageUrl, itemValueList, callback), SECONDS);
    }

    stopAutoTrack(callback?: () => void): void {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
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

export function createTimeTrackerOfSpentOnPage(): TimeTrackerOfSpentOnPage | null {
    return new TimeTrackerOfSpentOnPageImpl();
}
