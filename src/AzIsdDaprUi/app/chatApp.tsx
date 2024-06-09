import * as React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { DaprChatClientSocketConnection } from "./DaprChatClientSocketConnection";
import { HubConnectionState } from "@microsoft/signalr";

export interface ChatAppInput {
    clientSocketConnection: DaprChatClientSocketConnection
    allowChatSend: boolean
}

export function ChatApp({ clientSocketConnection, allowChatSend }: ChatAppInput) {
    const [connectionStatus, setConnectionStatus] = useState(clientSocketConnection.connectionStatus);
    const [messages, setMessages] = useState<string[]>([]);

    const userNameRef = useRef(null);
    const messageInputRef = useRef(null);

    useEffect(() => {
        clientSocketConnection.onConnectedStatusChangedSubject.subscribe((connectionStatus) => {
            setConnectionStatus(connectionStatus);
        });

        clientSocketConnection.onNotifyMessageReceievedSubject.subscribe((message) => {
            let allMessages = [...messages, message];
            setMessages(allMessages);
        })
    });

    function handleMessageSend(e) {
        let userName: any = userNameRef.current;
        let messageInput: any = messageInputRef.current;
        if (userName && userName.value && messageInput && messageInput.value) {
            clientSocketConnection.sendMessage(userName.value, messageInput.value);
        }
    }

    const messageList = messages.map((message, index, arr) => {
        return (<div className="message" key={index}>{message}</div>);
    });

    return (
        <div>
            <div className="connection-status">
                <p>Connection Status:<span className={HubConnectionState[connectionStatus] == HubConnectionState.Connected? 'connected' : 'notconnected'}>{HubConnectionState[connectionStatus]}</span></p>
            </div>

            {allowChatSend ? (
                <div className="message-input">
                    <fieldset><label htmlFor="userNameInput">UserName:</label><input id="userNameInput" type="text" ref={userNameRef}></input></fieldset>
                    <fieldset><label htmlFor="messageInput">Message:</label><input id="messageInput" type="text" ref={messageInputRef}></input></fieldset>
                    <button onClick={handleMessageSend}>Send Message</button>
                </div>
            ) : (null)}

            <div className="recieved-messages">
                {messageList}
            </div>
        </div>


    );
}

