import { milliseconds } from '../time/millisecondsType';

export interface ItemValue {
    id: string;
    name: string;
    url: string;
    time: milliseconds;
}

interface Param {
    id: string;
    name: string;
    url: string;
    time: milliseconds;
}

export const createItemValue = ({ id, name, url, time }: Param): ItemValue => ({
    id,
    name,
    url,
    time,
});
