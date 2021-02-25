import { getTabData } from './tab/tabData';
import { TabChangeInfoStatus } from './tab/tabChangeInfo';
import { TimeTrackerOfSpentOnPage, createTimeTrackerOfSpentOnPage } from './time/timeTrackerOfSpentOnPage';
import { convertMsToMMSSFormat, convertMsToTime } from './time/millisecondsToTimeConverter';
import { HOUR_TO_MILLISECONDS } from './time/time';
import { StorageWrapper, STORAGE_KEY } from './storage/storageWrapper';
import { itemValueListConnectPort } from './wasted_experience_item/itemValueListConnectPort';
import { ItemValue } from './wasted_experience_item/itemValue';
import { popupInitialStateConnectPort } from './popupInitialStateConnectPort';
import { getSyncStorage } from './storage/syncStorage';

class Background {
    private _storage: StorageWrapper;
    private _timeTrackerOfSpentOnPage: TimeTrackerOfSpentOnPage | null;
    private _itemValueList: ItemValue[];

    constructor(storage: StorageWrapper) {
        this._storage = storage;
        this._timeTrackerOfSpentOnPage = createTimeTrackerOfSpentOnPage();
        this._itemValueList = [];

        this._initChromeTabsEventListener();
    }

    private async _activateTrack(
        itemValueList: ItemValue[],
        callback?: (itemValue: ItemValue | null, itemValueList: ItemValue[] | null) => void,
    ): Promise<void> {
        const pageUrl = await this._getCurrentPageUrl();

        if (!pageUrl) {
            return;
        }

        this._timeTrackerOfSpentOnPage?.startAutoTrack(pageUrl, itemValueList, (value, itemValueList) => {
            if (value === null) {
                return;
            }

            callback && callback(value, itemValueList);
        });
    }

    private _deactivateTrack(): void {
        this._timeTrackerOfSpentOnPage?.stopAutoTrack();
    }

    private async _getCurrentPageUrl(): Promise<string | null> {
        const tab = await getTabData();
        const pageUrl = tab.url;

        if (!pageUrl || pageUrl === '') {
            return null;
        }

        return pageUrl;
    }

    private _setBadgeText(time?: number): void {
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

    private _initChromeTabsEventListener(): void {
        chrome.tabs.onActivated.addListener(() => {
            this._setBadgeText();
            this._deactivateTrack();
            this._activateTrack(this._itemValueList, (value) => {
                this._setBadgeText(value?.time);
            });
        });

        chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
            if (changeInfo.status === TabChangeInfoStatus.Complete) {
                this._setBadgeText();
                this._deactivateTrack();
                this._activateTrack(this._itemValueList, (value) => {
                    this._setBadgeText(value?.time);
                });
            }
        });

        chrome.tabs.onRemoved.addListener(() => {
            this._setBadgeText();
            this._deactivateTrack();
        });

        chrome.runtime.onConnect.addListener(async (port) => {
            if (port.name === popupInitialStateConnectPort.name) {
                this._initPopup(port);
            }

            if (port.name === itemValueListConnectPort.name) {
                this._updatePopup(port);
            }
        });
    }

    private async _initPopup(port: chrome.runtime.Port): Promise<void> {
        const itemValueList = await this._storage.get<ItemValue[]>(STORAGE_KEY);
        port.postMessage(itemValueList);
    }

    private async _updatePopup(port: chrome.runtime.Port): Promise<void> {
        // popupを開いたとき
        console.log('open popup');
        this._deactivateTrack();
        port.postMessage(this._itemValueList);
        this._activateTrack(this._itemValueList, (value, newList) => {
            this._setBadgeText(value?.time);
            port.postMessage(newList);
        });

        // アイテムを追加などしたとき
        // アイテムに対し何かした後にpopupを閉じたとき
        port.onMessage.addListener(async (newList: ItemValue[], port) => {
            console.log('onMessage', newList, port);
            this._itemValueList = newList;
            await this._storage.set(STORAGE_KEY, this._itemValueList);

            this._deactivateTrack();
            this._activateTrack(this._itemValueList, (value, newList) => {
                this._setBadgeText(value?.time);
                port.postMessage(newList);
            });
        });

        // popupを閉じたとき
        port.onDisconnect.addListener(async (port) => {
            console.log('disconnected:', this._itemValueList, port);
            await this._storage.set(STORAGE_KEY, this._itemValueList);
            this._deactivateTrack();
            this._activateTrack(this._itemValueList, (value) => {
                this._setBadgeText(value?.time);
            });
        });
    }
}

const storage = getSyncStorage();
new Background(storage);
