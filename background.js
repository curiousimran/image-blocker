// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("imageBlockerEnabled", ({ imageBlockerEnabled }) => {
    if (typeof imageBlockerEnabled === "undefined") {
      chrome.storage.sync.set({ imageBlockerEnabled: false });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (typeof message.toggle !== "undefined") {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { toggle: message.toggle });
        }
      }
    });
  }
});
