'use strict';
document.addEventListener('authEvent', function(e) {
    chrome.runtime.sendMessage({type: 'OpenAuth', href: e.detail, windowWidth: window.screen.width})
});

document.addEventListener('sendToPopup', function(e) {
    console.log('send to popup:');
    // contentScript.js
    // 向 popup 发送消息，通过 background 中转
    chrome.runtime.sendMessage({ action: 'messageFromContent', data: e.detail });

});

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'messageFromPopup') {
    console.log('Received from popup:', message.data);
  }
});