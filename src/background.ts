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

    private async _initItemValueList(): Promise<void> {
        const itemValueList = await this._storage.get<ItemValue[]>(STORAGE_KEY);
        this._itemValueList = itemValueList;
        this._timeTrackerOfSpentOnPage.setItemValueList(itemValueList);
    }

    private _initChromeTabsEventListener(): void {
        chrome.tabs.onActivated.addListener(async () => {
            setBadgeText();
            this._timeTrackerOfSpentOnPage.stopAutoTrack();

            const pageUrl = await getCurrentPageUrl();
            this._timeTrackerOfSpentOnPage.startAutoTrack(pageUrl, (value, newList) => {
                if (this._itemValueListConnectPort !== null) {
                    this._itemValueListConnectPort.postMessage(newList);
                }

                this._itemValueList = newList;
                this._timeTrackerOfSpentOnPage.setItemValueList(newList);
                setBadgeText(value?.time);
            });
        });

        chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
            if (changeInfo.status === TabChangeInfoStatus.Complete) {
                setBadgeText();
                this._timeTrackerOfSpentOnPage.stopAutoTrack();

                const pageUrl = await getCurrentPageUrl();
                this._timeTrackerOfSpentOnPage.startAutoTrack(pageUrl, (value, newList) => {
                    if (this._itemValueListConnectPort !== null) {
                        this._itemValueListConnectPort.postMessage(newList);
                    }

                    this._itemValueList = newList;
                    this._timeTrackerOfSpentOnPage.setItemValueList(newList);
                    setBadgeText(value?.time);
                });
            }
        });

        chrome.tabs.onRemoved.addListener(() => {
            setBadgeText();
            this._timeTrackerOfSpentOnPage.stopAutoTrack();
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
        port.postMessage(this._itemValueList);
    }

    private async _updatePopup(port: chrome.runtime.Port): Promise<void> {
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
