import { milliseconds } from './time/millisecondsType';

export interface ItemValue {
    name: string;
    url: string;
    time: milliseconds;
}

interface Param {
    name: string;
    url: string;
    time: milliseconds;
}

export const createItemValue = ({ name, url, time }: Param): ItemValue => ({
    name,
    url,
    time,
});
