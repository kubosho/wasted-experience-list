import { getCurrentPageUrl } from './tab/tabData';
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
    private _timeTrackerOfSpentOnPage: TimeTrackerOfSpentOnPage;
    private _itemValueList: ItemValue[];
    private _itemValueListConnectPort: chrome.runtime.Port | null;

    constructor(storage: StorageWrapper) {
        this._storage = storage;
        this._timeTrackerOfSpentOnPage = createTimeTrackerOfSpentOnPage();
        this._itemValueList = [];
        this._itemValueListConnectPort = null;

        this._initItemValueList().then(() => this._initChromeTabsEventListener());
    }

    private _activateAutoTrack(): void {
        getCurrentPageUrl().then((pageUrl) => {
            this._timeTrackerOfSpentOnPage.startAutoTrack(pageUrl, (value, newList) => {
                if (this._itemValueListConnectPort !== null) {
                    this._itemValueListConnectPort.postMessage(newList);
                }

                this._itemValueList = newList;
                this._timeTrackerOfSpentOnPage.setItemValueList(newList);
                setBadgeText(value?.time);
            });
        });
    }

    private _deactivateAutoTrack(): void {
        setBadgeText();
        this._timeTrackerOfSpentOnPage.stopAutoTrack();
    }

    private async _initItemValueList(): Promise<void> {
        const itemValueList = await this._storage.get<ItemValue[]>(STORAGE_KEY);
        this._itemValueList = itemValueList;
        this._timeTrackerOfSpentOnPage.setItemValueList(itemValueList);
    }

    private _initChromeTabsEventListener(): void {
        chrome.tabs.onActivated.addListener(() => {
            this._deactivateAutoTrack();
            this._activateAutoTrack();
        });

        chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
            if (changeInfo.status === TabChangeInfoStatus.Complete) {
                this._deactivateAutoTrack();
                this._activateAutoTrack();
            }
        });

        chrome.tabs.onRemoved.addListener(() => {
            this._deactivateAutoTrack();
        });

        chrome.runtime.onConnect.addListener((port) => {
            if (port.name === popupInitialStateConnectPort.name) {
                this._initPopup(port);
            }

            if (port.name === itemValueListConnectPort.name) {
                this._updatePopup(port);
            }
        });
    }

    private _initPopup(port: chrome.runtime.Port): void {
        port.postMessage(this._itemValueList);
    }

    private _updatePopup(port: chrome.runtime.Port): void {
        this._itemValueListConnectPort = port;
        port.postMessage(this._itemValueList);

        port.onMessage.addListener(async (newList: ItemValue[]) => {
            this._itemValueList = newList;
            this._timeTrackerOfSpentOnPage.setItemValueList(newList);
            await this._storage.set(STORAGE_KEY, newList);
        });

        port.onDisconnect.addListener(async () => {
            this._itemValueListConnectPort = null;
            this._timeTrackerOfSpentOnPage.setItemValueList(this._itemValueList);
            await this._storage.set(STORAGE_KEY, this._itemValueList);
        });
    }
}

const storage = getSyncStorage();
new Background(storage);
