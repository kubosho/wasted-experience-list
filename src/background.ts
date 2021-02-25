import { getTabData } from './tab/tabData';
import { TabChangeInfoStatus } from './tab/tabChangeInfo';
import { TimeTrackerOfSpentOnPage, createTimeTrackerOfSpentOnPage } from './time/timeTrackerOfSpentOnPage';
import { StorageWrapper, STORAGE_KEY } from './storage/storageWrapper';
import { itemValueListConnectPort } from './wasted_experience_item/itemValueListConnectPort';
import { ItemValue } from './wasted_experience_item/itemValue';
import { popupInitialStateConnectPort } from './popupInitialStateConnectPort';
import { getSyncStorage } from './storage/syncStorage';
import { setBadgeText } from './badge/badgeText';

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

    private _initChromeTabsEventListener(): void {
        chrome.tabs.onActivated.addListener(() => {
            setBadgeText();
            this._deactivateTrack();
            this._activateTrack(this._itemValueList, (value) => {
                setBadgeText(value?.time);
            });
        });

        chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
            if (changeInfo.status === TabChangeInfoStatus.Complete) {
                setBadgeText();
                this._deactivateTrack();
                this._activateTrack(this._itemValueList, (value) => {
                    setBadgeText(value?.time);
                });
            }
        });

        chrome.tabs.onRemoved.addListener(() => {
            setBadgeText();
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
            setBadgeText(value?.time);
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
                setBadgeText(value?.time);
                port.postMessage(newList);
            });
        });

        // popupを閉じたとき
        port.onDisconnect.addListener(async (port) => {
            console.log('disconnected:', this._itemValueList, port);
            await this._storage.set(STORAGE_KEY, this._itemValueList);
            this._deactivateTrack();
            this._activateTrack(this._itemValueList, (value) => {
                setBadgeText(value?.time);
            });
        });
    }
}

const storage = getSyncStorage();
new Background(storage);
