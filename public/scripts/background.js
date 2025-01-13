// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let currentWindow = null;
let contentTabId = null;

chrome.windows.onRemoved.addListener((windowId) => {
  if (currentWindow?.id === windowId) {
    currentWindow = null;
  }
});
chrome.runtime.onMessage.addListener(async (request, sender) => {
  console.log("chrome.runtime.onMessage.addListener");
  if (request.type === "OpenAuth") {
    if (currentWindow) {
      await chrome.windows.remove(currentWindow.id);
    }
    contentTabId = sender.tab.id;

    chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
      const data = request.href.includes("?i_m=")
        ? { type: "base64", payload: request.href.split("?i_m=")[1] }
        : {
            type: "link",
            payload: decodeURIComponent(request.href.split("?request_uri=")[1]),
          };

      // 窗口大小设置
      const windowWidth = 390;
      const windowHeight = 600;

      // 计算右上角的位置
      const left = currentWindow.left + currentWindow.width - windowWidth;
      const top = currentWindow.top;

      chrome.windows.create(
        {
          url: chrome.runtime.getURL(
            `index.html#/auth?type=${data.type}&payload=${data.payload}`
          ),
          type: "popup",
          focused: true,
          width: windowWidth,
          height: windowHeight,
          left: left,
          top: top,
        }, (window) => {
        }
      );
    });
    // 返回 true 表示异步响应
    return true;
  } 

  if (request.action === 'messageFromContent' && popupPort) {
    console.log("Received request: " + JSON.stringify(request));
    popupPort.postMessage(request);
  }
});

// background.js
let popupPort = null;

// 监听 popup 的连接
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup-channel") {
    console.log("connect");
    popupPort = port;

    // 监听 popup 发来的消息，并转发到 content script
    port.onMessage.addListener((message) => {
      if (message.action === 'messageFromPopup') {
        chrome.windows.getAll({ populate: true }, (windows) => {
          const popupTab = windows.flatMap(win => win.tabs).find(tab => tab.id === contentTabId);
          if (popupTab) {
            chrome.tabs.sendMessage(popupTab.id, message);
          }
        });
      }
    });

    // 在 popup 关闭时清除连接
    port.onDisconnect.addListener(() => {
      popupPort = null;
    });
  }
});