import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChatApp } from "./chatApp";
import { DaprClientSocketConnection, SignalRSocketFactory } from "./signalrSocketFactory";

let chatApp = document.getElementById("chat-app");
const serverMessageChatHubUrl = '/hub/chat';
let socketFactory:SignalRSocketFactory = new SignalRSocketFactory();
let serverSocketConnection:DaprClientSocketConnection = socketFactory.createClientSignalRConnection(serverMessageChatHubUrl);

if(chatApp){
    const root = createRoot(chatApp);
    root.render(<ChatApp clientSocketConnection={serverSocketConnection} allowChatSend={false}/>);

    setTimeout(() => {
        serverSocketConnection.startConnection();
    }, 500);
}