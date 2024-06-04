using Dapr.Actors;

namespace AzIsdDapr.Common.Dapr.Actors
{
    public interface IBankAccount : IActor
    {
        Task StartBankAccountAsync();
        Task AddTransactionAsync(decimal depositAmount);
    }
}
