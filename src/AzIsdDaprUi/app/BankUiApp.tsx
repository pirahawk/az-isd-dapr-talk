import * as React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { BankAccountState, DaprBankUIClientSocketConnection } from "./DaprBankUIClientSocketConnection";

export interface BankUiAppInput {
    clientSocketConnection: DaprBankUIClientSocketConnection
}

export function BankUiApp({ clientSocketConnection }: BankUiAppInput) {
    const [connectionStatus, setConnectionStatus] = useState(clientSocketConnection.connectionStatus);
    const [bankAccount, setBankAccount] = useState<BankAccountState>();

    const userNameRef = useRef(null);
    const messageInputRef = useRef(null);

    useEffect(() => {
        clientSocketConnection.onConnectedStatusChangedSubject.subscribe((connectionStatus) => {
            setConnectionStatus(connectionStatus);
        });

        clientSocketConnection.onNotifyBankAccountUpdatedSubject.subscribe((bankAccountState) => {
            setBankAccount(bankAccountState);
        })
    });

    const transactionList = bankAccount && bankAccount.transactions?
    
    bankAccount.transactions.map((transaction, index, arr) => {
        return (<li key={transaction.id}>
            <span>{transaction.amount}</span>|
            <span>{transaction.transactionState}</span>|
            <span>{transaction.createdUtc}</span>|
            <span>{transaction.processedUtc}</span>|
            </li>);
    })
    : null;

    return (
        <div>
            <div className="connection-status">
                <p>Connection Status:<span>{HubConnectionState[connectionStatus]}</span></p>
            </div>

            <div className="message-list">
                
                {bankAccount? (
                    <div>
                        <p><label htmlFor="">Balance</label><span>{bankAccount.balance}</span></p>
                        <p>Transactions:</p>
                        <ul>
                            {transactionList}
                        </ul>
                     </div>
                ): (
                    <p>Awaiting Account information</p>
                )}

            </div>
        </div>


    );
}
