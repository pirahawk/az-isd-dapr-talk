import * as signalR from "@microsoft/signalr";
import { HubConnectionState } from "@microsoft/signalr";
import { Subject } from "rxjs";

export class SignalRSocketFactory {
    public createClientSignalRConnection(hubUrl: string): DaprClientSocketConnection {
        let clientConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(hubUrl)
            .build();

        let mySocketConnection = new DaprClientSocketConnection(clientConnection);
        return mySocketConnection;
    }
}

export class DaprClientSocketConnection {
    public onConnectedStatusChangedSubject: Subject<HubConnectionState>;
    public onNotifyMessageReceievedSubject: Subject<string>;

    constructor(private connection: signalR.HubConnection) {
        this.onConnectedStatusChangedSubject = new Subject<HubConnectionState>();
        this.onNotifyMessageReceievedSubject = new Subject<string>();
        this.bindConnection();
    }

    public get connectionStatus(): HubConnectionState {
        return this.connection.state;
    }

    public startConnection(): void {
        this.connection.start()
            .then(() => {
                console.log(`Signalr: Connection Started`);
                this.updateConnectionStatus();
            })
            .catch((reason: any) => {
                console.error(`Signalr: Connection Failed to Start: ${reason}`);
                this.updateConnectionStatus();
            });
    }

    public sendMessage(userName:string, message:string):void {
        this.connection.invoke('SendChatMessage', userName, message);
    }

    private updateConnectionStatus() {
        this.onConnectedStatusChangedSubject.next(this.connection.state);
    }

    private bindConnection() {
        this.connection.onclose((error: Error) => {
            console.error(`Signalr: Connection Closed: ${error}`);
            this.updateConnectionStatus();

            // attempt restart
            setTimeout(() => {
                this.startConnection();
            }, 1000);
        });

        this.connection.onreconnecting((error: Error) => {
            console.error(`Signalr: Connection Reconnecting because of: ${error}`);
            this.updateConnectionStatus();
        })

        this.connection.onreconnected((connectionId: string) => {
            console.log(`Signalr: Connection Connected with ID: ${connectionId}`);
            this.updateConnectionStatus();
        });

        this.connection.on("NotifySendTextMessage", (message: string) => {
            console.log(`Signalr: "NotifySendTextMessage": ${message}`);
            this.onNotifyMessageReceievedSubject.next(message);
        });
    }
}