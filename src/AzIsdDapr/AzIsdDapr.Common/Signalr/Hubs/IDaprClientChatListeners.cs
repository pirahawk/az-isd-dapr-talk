namespace AzIsdDapr.Common.Signalr.Hubs
{
    public interface IDaprClientChatListeners
    {
        Task NotifySendTextMessage(string message);
    }
}
