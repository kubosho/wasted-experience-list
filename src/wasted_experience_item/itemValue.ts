import { milliseconds } from '../time/millisecondsType';

export interface ItemValue {
    id: string;
    url: string;
    time: milliseconds;
}

interface Param {
    id: string;
    url: string;
    time: milliseconds;
}

export const createItemValue = ({ id, url, time }: Param): ItemValue => ({
    id,
    url,
    time,
});
