import * as React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { DaprBankUIClientSocketConnection } from "./DaprBankUIClientSocketConnection";

export interface BankUiAppInput {
    clientSocketConnection: DaprBankUIClientSocketConnection
}

export function BankUiApp({ clientSocketConnection }: BankUiAppInput) {
    const [connectionStatus, setConnectionStatus] = useState(clientSocketConnection.connectionStatus);
    const [messages, setMessages] = useState<string[]>([]);

    const userNameRef = useRef(null);
    const messageInputRef = useRef(null);

    useEffect(() => {
        clientSocketConnection.onConnectedStatusChangedSubject.subscribe((connectionStatus) => {
            setConnectionStatus(connectionStatus);
        });

        clientSocketConnection.onNotifyBankAccountUpdatedSubject.subscribe((message) => {
            let allMessages = [...messages, message];
            setMessages(allMessages);
        })
    });

    const messageList = messages.map((message, index, arr) => {
        return (<li key={index}>{message}</li>);
    });

    return (
        <div>
            <div className="connection-status">
                <p>Connection Status:<span>{HubConnectionState[connectionStatus]}</span></p>
            </div>

            <div className="message-list">
                <ul>
                    {messageList}
                </ul>
            </div>
        </div>


    );
}
