// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let currentWindow = null;
chrome.windows.onRemoved.addListener((windowId) => {
  if (currentWindow?.id === windowId) {
    currentWindow = null;
  }
});
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === "OpenAuth") {
    if (currentWindow) {
      await chrome.windows.remove(currentWindow.id);
    }
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
        },
        () => {
          console.log("Opened popup!");
        }
      );
    });
    // 返回 true 表示异步响应
    return true;
  }
});
