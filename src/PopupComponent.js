// // popup.js
// import React, { useEffect } from 'react';

// const PopupComponent = () => {
//   useEffect(() => {
//     /* eslint-disable no-undef */
//     const port = chrome.runtime.connect({ name: "popup-channel" });

//     console.log("Connect---");
//     // 接收来自 content script 的消息
//     port.onMessage.addListener((message) => {
//       if (message.action === 'messageFromContent') {
//         console.log('Received from content script:', message.data);
//       }
//     })
//   }, []);

//       // 向 content script 发送消息，通过 background 中转
//       const sendMessageToContent = () => {
//         console.log('send to content script:');
//       port.postMessage({ action: 'messageFromPopup', data: 'Hello, content script!' });
//     };

//   return (
//     <div>
//       <button onClick={() => sendMessageToContent()}>Send Message to Content</button>
//     </div>
//   );
// };

// export default PopupComponent;