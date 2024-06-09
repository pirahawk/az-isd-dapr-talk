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
        let transactionState:string = 'Processing';

        switch(transaction.transactionState){
            case 1:
                transactionState= 'Processing';
                break;
            case 2:
                transactionState= 'Cleared';
                break;
            case 3:
                transactionState= 'Failed';
                break;
        }

        let transactionClass:string = `transaction-transactionState ${transactionState}`;
        return (<div key={transaction.id}>
            <span className="transaction-amount">{transaction.amount}</span>
            <span className={transactionClass}>{transactionState}</span>
            <span className="transaction-createdUtc">{transaction.createdUtc}</span>
            <span className="transaction-processedUtc">{transaction.processedUtc}</span>
            </div>);
    })
    : null;

    return (
        <div>
            <div className="connection-status">
                <p>Connection Status:<span className={HubConnectionState[connectionStatus] == HubConnectionState.Connected? 'connected' : 'notconnected'}>{HubConnectionState[connectionStatus]}</span></p>
            </div>

            <div className="bank-account">
                
                {bankAccount? (
                    <div>
                        <div className="account-summary">
                            <p><label >Account Name</label><span>{bankAccount.customerName}</span></p>
                            <p><label>Balance</label><span className="account-blance">{bankAccount.balance}</span></p>
                        </div>
                        
                        <div className="account-transactions">
                            <p>Transactions:</p>
                            <div className="account-transaction-list">
                                <div><span>Amount</span><span>State</span><span>Created</span><span>Processed</span></div>
                                {transactionList}
                            </div>
                        </div>
                     </div>
                ): (
                    <p>Awaiting Account information</p>
                )}

            </div>
        </div>


    );
}
