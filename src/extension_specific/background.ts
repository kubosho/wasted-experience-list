import { createTimeOnPage } from '../timeOnPage';

function main(): void {
    const timeOnPage = createTimeOnPage();

    chrome.tabs.onActivated.addListener(async ({ tabId }) => await timeOnPage.track(tabId));
    chrome.tabs.onUpdated.addListener(async (tabId) => await timeOnPage.track(tabId));
}

main();
