export function getTabData(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => chrome.tabs.get(tabId, resolve));
}
