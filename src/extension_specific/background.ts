import { createTimeOnPage } from '../timeOnPage';

function main(): void {
    const timeOnPage = createTimeOnPage();

    chrome.tabs.onActivated.addListener(async ({ tabId }) => timeOnPage.track(tabId));
}

main();
