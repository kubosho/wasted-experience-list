import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { milliseconds } from './millisecondsType';

const DAY_TO_MILLISECONDS = 60 * 60 * 24 * 1000;

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
