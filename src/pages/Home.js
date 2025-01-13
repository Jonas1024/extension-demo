import React, { useEffect, useState } from "react";
import { HeaderComponent } from "../components/app-header";
import { AccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import { useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [port, setPort] = useState([]);

  useEffect(() => {
    /* eslint-disable no-undef */
    const port = chrome.runtime.connect({ name: "popup-channel" });
    setPort(port);
    console.log("Connect---");
    // 接收来自 content script 的消息
    port.onMessage.addListener((message) => {
      console.log("recieve to content script");
      if (message.action === "messageFromContent") {
        console.log("Received from content script:", message.data);
      }
    });
  }, []);

  // 向 content script 发送消息，通过 background 中转
  const sendMessageToContent = () => {
    console.log("send to content script:");
    port.postMessage({
      action: "messageFromPopup",
      data: "Hello, content script!",
    });
  };

  useEffect(() => {
    window.addEventListener("storage", () => {
      console.log("Change to local storage!");
      let accounts = JSON.parse(localStorage.getItem("accounts"));
      setAccounts(accounts ? accounts : []);
    });
    let _accounts = JSON.parse(localStorage.getItem("accounts"));
    if (!_accounts || _accounts.length <= 0) {
      navigate("/welcome");
    } else {
      setAccounts(_accounts);
    }
    getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getExtensionServiceInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  const handleCredentialDelete = async (credentialId) => {
    const { credWallet } = ExtensionService.getExtensionServiceInstance();
    await credWallet.remove(credentialId);
    await getCredentials();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {accounts.length <= 0 && <p>Redirecting...</p>}
      {accounts.length > 0 && (
        <div>
          <HeaderComponent />
          <AccountInfo accounts={accounts} />
          <CredentialsInfo
            credentials={credentials}
            onDeleteCredential={handleCredentialDelete}
          />
          <button onClick={() => sendMessageToContent()} style={{position: "fixed", bottom: '20px'}}>
            Send Message to Content
          </button>
        </div>
      )}
    </div>
  );
};
