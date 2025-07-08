// content.js
(function () {
  const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const STYLE_ID = "image-blocker-style";

  const blockImages = () => {
    // Block <img> tags
    document.querySelectorAll("img").forEach(img => {
      img.dataset.originalSrc = img.src;
      img.src = TRANSPARENT_PIXEL;
    });

    // Block <picture> tags
    document.querySelectorAll("picture").forEach(pic => {
      pic.querySelectorAll("source").forEach(source => source.srcset = "");
    });

    // Block background images
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `* { background-image: none !important; }`;
      document.head.appendChild(style);
    }
  };

  const unblockImages = () => {
    document.querySelectorAll("img").forEach(img => {
      if (img.dataset.originalSrc) {
        img.src = img.dataset.originalSrc;
        delete img.dataset.originalSrc;
      }
    });

    document.querySelectorAll("picture").forEach(pic => {
      pic.querySelectorAll("source").forEach(source => source.removeAttribute("srcset"));
    });

    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  };

  const handleMutation = mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === "IMG") {
            node.dataset.originalSrc = node.src;
            node.src = TRANSPARENT_PIXEL;
          } else if (node.querySelectorAll) {
            node.querySelectorAll("img").forEach(img => {
              img.dataset.originalSrc = img.src;
              img.src = TRANSPARENT_PIXEL;
            });
            node.querySelectorAll("source").forEach(source => source.srcset = "");
          }
        }
      }
    }
  };

  const observer = new MutationObserver(handleMutation);

  chrome.storage.sync.get("imageBlockerEnabled", ({ imageBlockerEnabled }) => {
    if (imageBlockerEnabled) {
      blockImages();
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.toggle === true) {
      blockImages();
      observer.observe(document.body, { childList: true, subtree: true });
    } else if (message.toggle === false) {
      unblockImages();
      observer.disconnect();
    }
  });
})();