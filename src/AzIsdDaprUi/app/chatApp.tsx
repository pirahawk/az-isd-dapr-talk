import * as React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { DaprClientSocketConnection } from "./signalrSocketFactory";
import { HubConnectionState } from "@microsoft/signalr";

export interface ChatAppInput {
    clientSocketConnection: DaprClientSocketConnection
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
        return (<li key={index}>{message}</li>);
    });

    return (
        <div>
            <div className="connection-status">
                <p>Connection Status:<span>{HubConnectionState[connectionStatus]}</span></p>
            </div>

            {allowChatSend ? (
                <div className="message-send">

                    <label>UserName:<input type="text" ref={userNameRef}></input></label>
                    <br></br>
                    <label>Message:<input type="text" ref={messageInputRef}></input></label>
                    <br></br>
                    <button onClick={handleMessageSend}>Send Message</button>
                </div>
            ) : (null)}

            <div className="message-list">
                <ul>
                    {messageList}
                </ul>
            </div>
        </div>


    );
}