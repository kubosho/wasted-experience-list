export function getTabData(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
            resolve(tabs[0]);
        });
    });
}

export async function getCurrentPageUrl(): Promise<string | null> {
    const tab = await getTabData();
    const pageUrl = tab.url;

    if (!pageUrl || pageUrl === '') {
        return null;
    }

    return pageUrl;
}
