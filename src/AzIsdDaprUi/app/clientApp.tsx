import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChatApp } from "./chatApp";
import { SignalRSocketFactory } from "./signalrSocketFactory";
import { DaprChatClientSocketConnection } from "./DaprChatClientSocketConnection";

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

