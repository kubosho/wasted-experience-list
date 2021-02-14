import { getTabData } from './tab/tabData';
import { TabChangeInfoStatus } from './tab/tabChangeInfo';
import { createTimeTrackerOfSpentOnPage } from './time/timeTrackerOfSpentOnPage';

const timeTrackerOfSpentOnPage = createTimeTrackerOfSpentOnPage();

function main(): void {
    chrome.tabs.onActivated.addListener(({ tabId }) => {
        activateTrack(tabId);
        saveStorage();
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (changeInfo.status === TabChangeInfoStatus.Complete) {
            activateTrack(tabId);
            saveStorage();
        }
    });

    chrome.tabs.onRemoved.addListener(() => {
        saveStorage();
    });
}

main();

async function activateTrack(tabId: number): Promise<void> {
    const tab = await getTabData(tabId);
    const pageUrl = tab.url;

    if (!pageUrl) {
        return;
    }

    timeTrackerOfSpentOnPage?.untrack();
    timeTrackerOfSpentOnPage?.track(pageUrl);
}

function saveStorage(): void {
    const itemValueList = timeTrackerOfSpentOnPage?.itemValueList;
    itemValueList && timeTrackerOfSpentOnPage?.saveToStorage(itemValueList);
}
