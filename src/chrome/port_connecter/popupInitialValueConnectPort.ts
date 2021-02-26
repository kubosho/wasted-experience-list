export const popupInitialValueConnectPort = { name: 'popupInitialValueConnectPort' };

export const connectPopupInitialValueConnectPort = (): chrome.runtime.Port => {
    return chrome.runtime.connect(popupInitialValueConnectPort);
};
