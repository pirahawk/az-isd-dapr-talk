using AzIsdDapr.Common.Dapr.Actors;

namespace AzIsdDapr.Common.Signalr.Hubs
{
    public interface IDaprBankUiListener{
        Task BankAccountUpdated(AccountState accountState);
    }
}
