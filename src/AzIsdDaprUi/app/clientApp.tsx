import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChatApp } from "./chatApp";
import { SignalRSocketFactory } from "./signalrSocketFactory";
import { DaprChatClientSocketConnection } from "./DaprChatClientSocketConnection";
import { BankClientApp } from "./BankClientApp";

let chatApp = document.getElementById("chat-app");
const clientMessageChatHubUrl = '/hub/chat';
let socketFactory:SignalRSocketFactory = new SignalRSocketFactory();
let clientSocketConnection:DaprChatClientSocketConnection = socketFactory.createChatClientSignalRConnection(clientMessageChatHubUrl);

if(chatApp){
    const root = createRoot(chatApp);
    root.render(<ChatApp clientSocketConnection={clientSocketConnection} allowChatSend={true}/>);

    setTimeout(() => {
        clientSocketConnection.startConnection();
    }, 500);
}

let bankClientApp = document.getElementById("bank-ui");

if(bankClientApp){
    const root = createRoot(bankClientApp);
    root.render(<BankClientApp/>);
}