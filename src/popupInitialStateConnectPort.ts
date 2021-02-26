export const popupInitialStateConnectPort = { name: 'popupInitialStateConnectPort' };

export const connectPopupInitialStateConnectPort = (): chrome.runtime.Port => {
    return chrome.runtime.connect(popupInitialStateConnectPort);
};
