// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const toggleBtn = document.getElementById("toggle");

  chrome.storage.sync.get("imageBlockerEnabled", ({ imageBlockerEnabled }) => {
    const enabled = !!imageBlockerEnabled;
    status.textContent = enabled ? "Images Blocked" : "Images Allowed";
    toggleBtn.textContent = enabled ? "Disable" : "Enable";

    toggleBtn.onclick = () => {
      const newState = !enabled;
      chrome.storage.sync.set({ imageBlockerEnabled: newState }, () => {
        chrome.runtime.sendMessage({ toggle: newState });
        window.close();
      });
    };
  });
});