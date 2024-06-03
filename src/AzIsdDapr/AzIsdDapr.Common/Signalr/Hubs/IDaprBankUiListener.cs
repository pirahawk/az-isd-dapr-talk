namespace AzIsdDapr.Common.Signalr.Hubs
{
    public interface IDaprBankUiListener{
        Task BankAccountUpdated(string message);
    }
}
