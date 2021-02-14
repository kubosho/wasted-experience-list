import { getTabData } from './tab/tabData';
import { TabChangeInfoStatus } from './tab/tabChangeInfo';
import { TimeTrackerOfSpentOnPage, createTimeTrackerOfSpentOnPage } from './time/timeTrackerOfSpentOnPage';

class Background {
    private _timeTrackerOfSpentOnPage: TimeTrackerOfSpentOnPage | null;

    constructor() {
        this._timeTrackerOfSpentOnPage = createTimeTrackerOfSpentOnPage();
        this._initEventListener();
    }

    private async _activateTrack(tabId: number): Promise<void> {
        const tab = await getTabData(tabId);
        const pageUrl = tab.url;

        if (!pageUrl) {
            return;
        }

        this._timeTrackerOfSpentOnPage?.stopAutoTrack();
        this._timeTrackerOfSpentOnPage?.autoTrack(pageUrl);
    }

    private _saveStorage(): void {
        const itemValueList = this._timeTrackerOfSpentOnPage?.itemValueList;
        itemValueList && this._timeTrackerOfSpentOnPage?.saveToStorage(itemValueList);
    }

    private _initEventListener(): void {
        chrome.tabs.onActivated.addListener(({ tabId }) => {
            this._activateTrack(tabId);
            this._saveStorage();
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
            if (changeInfo.status === TabChangeInfoStatus.Complete) {
                this._activateTrack(tabId);
                this._saveStorage();
            }
        });

        chrome.tabs.onRemoved.addListener(() => {
            this._saveStorage();
        });
    }
}

new Background();
