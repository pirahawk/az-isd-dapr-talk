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
        <div className="bankController">
            <fieldset>
                <legend>Create Bank Account</legend>
                <button onClick={handleMessageSend}>Activate Account</button>
            </fieldset>
            <fieldset>
                <legend>Post Bank Transaction</legend>
                <label htmlFor="transactionAmount">Amount:<input id="transactionAmount" type="number" placeholder="£" ref={transactionAmountRef}></input></label>
                <button onClick={handlePostTransaction}>Post Transaction</button>
            </fieldset>
        </div>

    );
}
