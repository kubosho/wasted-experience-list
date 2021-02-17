import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { DAY_TO_MILLISECONDS } from './time';
import { milliseconds } from './millisecondsType';

export function convertMsToTime(durationMs: milliseconds): string {
    dayjs.extend(duration);

    const dayString = dayjs.duration(durationMs).format('D');
    const timeString = dayjs.duration(durationMs).format('HH:mm:ss');

    if (durationMs >= 2 * DAY_TO_MILLISECONDS) {
        return `${dayString} days ${timeString}`;
    }

    if (durationMs >= 1 * DAY_TO_MILLISECONDS) {
        return `${dayString} day ${timeString}`;
    }

    return timeString;
}

export function convertMsToMMSSFormat(durationMs: milliseconds): string {
    dayjs.extend(duration);

    return dayjs.duration(durationMs).format('mm:ss');
}
