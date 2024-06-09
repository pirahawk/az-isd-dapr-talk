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

    const transactionList = bankAccount && bankAccount.transactions ?

        bankAccount.transactions.map((transaction, index, arr) => {
            let transactionState: string = 'Processing';

            switch (transaction.transactionState) {
                case 1:
                    transactionState = 'Processing';
                    break;
                case 2:
                    transactionState = 'Cleared';
                    break;
                case 3:
                    transactionState = 'Failed';
                    break;
            }

            let transactionClass: string = `transaction-transactionState ${transactionState}`;
            return (<tr key={transaction.id}>
                <td className="transaction-amount">{transaction.amount}</td>
                <td className={transactionClass}>{transactionState}</td>
                <td className="transaction-createdUtc">{transaction.createdUtc}</td>
                <td className="transaction-processedUtc">{transaction.processedUtc}</td>
            </tr>);
        })
        : null;

    return (
        <div>
            <div className="connection-status">
                <p>Connection Status:<span className={HubConnectionState[connectionStatus] == HubConnectionState.Connected ? 'connected' : 'notconnected'}>{HubConnectionState[connectionStatus]}</span></p>
            </div>

            <div className="bank-account">

                {bankAccount ? (
                    <div>
                        <div className="account-summary">
                            <p><label >Account Name</label><span>{bankAccount.customerName}</span></p>
                            <p><label>Balance</label><span className="account-blance">{bankAccount.balance}</span></p>
                        </div>

                        <div className="account-transactions">
                            <p>Transactions:</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Amount</th>
                                        <th scope="col">State</th>
                                        <th scope="col">Created</th>
                                        <th scope="col">Processed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionList}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p>Awaiting Account information</p>
                )}

            </div>
        </div>


    );
}
