import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter  } from 'react-router-dom';
import './styles/index.css';
// import PopupComponent from './PopupComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));

  //   /* eslint-disable no-undef */
  //   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //     console.log('Received message from current page:');
  //     if (message.action === 'messageFromPage') {
  //     console.log('Received message from current page:', message.data);
  //     }
  // });

root.render(
  <React.StrictMode>
      <HashRouter>

          {/* <PopupComponent/> */}
          <App/>
      </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
