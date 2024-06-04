import * as signalR from "@microsoft/signalr";
import { DaprChatClientSocketConnection } from "./DaprChatClientSocketConnection";
import { DaprBankUIClientSocketConnection } from "./DaprBankUIClientSocketConnection";

export class SignalRSocketFactory {
    public createChatClientSignalRConnection(hubUrl: string): DaprChatClientSocketConnection {
        let clientConnection: signalR.HubConnection = this.createSignalrConnection(hubUrl);
        let mySocketConnection = new DaprChatClientSocketConnection(clientConnection);
        return mySocketConnection;
    }

    public createBankUiClientSignalRConnection(hubUrl: string): DaprBankUIClientSocketConnection {
        let clientConnection: signalR.HubConnection = this.createSignalrConnection(hubUrl);
        let mySocketConnection = new DaprBankUIClientSocketConnection(clientConnection);
        return mySocketConnection;
    }

    private createSignalrConnection(hubUrl: string): signalR.HubConnection {
        let clientConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(hubUrl)
            .build();

        return clientConnection;
    }
}

