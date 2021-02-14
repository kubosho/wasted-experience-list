import { TabChangeInfoStatus } from './tab/tabChangeInfo';
import { createTimeTrackerOfSpentOnPage } from './time/timeTrackerOfSpentOnPage';

function main(): void {
    const timeTrackerOfSpentOnPage = createTimeTrackerOfSpentOnPage();
    if (!timeTrackerOfSpentOnPage) {
        return;
    }

    chrome.tabs.onActivated.addListener((activeInfo) => {
        timeTrackerOfSpentOnPage.untrack();
        timeTrackerOfSpentOnPage.track(activeInfo.tabId);

        const itemValueList = timeTrackerOfSpentOnPage.itemValueList;
        itemValueList && timeTrackerOfSpentOnPage.saveToStorage(itemValueList);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (changeInfo.status === TabChangeInfoStatus.Complete) {
            timeTrackerOfSpentOnPage.untrack();
            timeTrackerOfSpentOnPage.track(tabId);

            const itemValueList = timeTrackerOfSpentOnPage.itemValueList;
            itemValueList && timeTrackerOfSpentOnPage.saveToStorage(itemValueList);
        }
    });

    chrome.tabs.onRemoved.addListener(() => {
        const itemValueList = timeTrackerOfSpentOnPage.itemValueList;
        itemValueList && timeTrackerOfSpentOnPage.saveToStorage(itemValueList);
    });
}

main();
