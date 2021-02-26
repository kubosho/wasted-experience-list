import { convertMsToMMSSFormat, convertMsToTime } from '../../time/millisecondsToTimeConverter';
import { HOUR_TO_MILLISECONDS } from '../../time/time';

export function setBadgeText(time?: number): void {
    if (!time) {
        chrome.browserAction.setBadgeText({
            text: '',
        });
        return;
    }

    const badgeText = time < 1 * HOUR_TO_MILLISECONDS ? convertMsToMMSSFormat(time) : convertMsToTime(time);

    chrome.browserAction.setBadgeText({
        text: badgeText,
    });
}
