import * as React from "react";
import { useRef } from "react";




export function BankClientApp() {
    const transactionAmountRef = useRef(null);

    async function handleMessageSend(e) {
    
        let response = await fetch('/Bank/Start', {
            method: 'POST',
        });
    }

    async function handlePostTransaction(e) {
        let transactionAmount: any = transactionAmountRef.current;
        
        if(!transactionAmount && transactionAmount.value){
            return;
        }

        let response = await fetch('/Bank/Transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(transactionAmount.value)
        });
    }

    return (
        <div>
            <p>Bank Client App</p>
            <div>
                <p>Create Bank Account</p>
                <button onClick={handleMessageSend}>Activate Account</button>
            </div>
            <div>
                <p>Post Bank Transaction</p>
                <label>Amount:<input type="number" ref={transactionAmountRef}></input></label>
                <button onClick={handlePostTransaction}>Post Transaction</button>
            </div>
        </div>

    );
}
