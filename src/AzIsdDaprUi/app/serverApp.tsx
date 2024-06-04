import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChatApp } from "./chatApp";
import { SignalRSocketFactory } from "./signalrSocketFactory";
import { DaprChatClientSocketConnection } from "./DaprChatClientSocketConnection";
import { Hello } from "./hello";
import { DaprBankUIClientSocketConnection } from "./DaprBankUIClientSocketConnection";
import { BankUiApp } from "./BankUiApp";

const serverMessageChatHubUrl = '/hub/chat';
const serverBankUiHubUrl = '/hub/bankui';
const signalrConnectionStartTimeoutMs = 500;


let socketFactory:SignalRSocketFactory = new SignalRSocketFactory();
let chatApp = document.getElementById("chat-app");
let serverClientSocketConnection:DaprChatClientSocketConnection = socketFactory.createChatClientSignalRConnection(serverMessageChatHubUrl);

if(chatApp){
    const root = createRoot(chatApp);
    root.render(<ChatApp clientSocketConnection={serverClientSocketConnection} allowChatSend={false}/>);

    setTimeout(() => {
        serverClientSocketConnection.startConnection();
    }, signalrConnectionStartTimeoutMs);
}


let bankUiApp = document.getElementById("bank-ui");
let serverBankUiSocketConnection:DaprBankUIClientSocketConnection = socketFactory.createBankUiClientSignalRConnection(serverBankUiHubUrl);

if(bankUiApp){
    const root = createRoot(bankUiApp);
    root.render(<BankUiApp clientSocketConnection={serverBankUiSocketConnection}/>);

    setTimeout(() => {
        serverBankUiSocketConnection.startConnection();
    }, signalrConnectionStartTimeoutMs);
}