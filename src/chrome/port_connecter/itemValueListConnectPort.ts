export const itemValueListConnectPort = { name: 'itemValueListConnectPort' };

export const connectItemValueListConnectPort = (): chrome.runtime.Port => {
    return chrome.runtime.connect(itemValueListConnectPort);
};
