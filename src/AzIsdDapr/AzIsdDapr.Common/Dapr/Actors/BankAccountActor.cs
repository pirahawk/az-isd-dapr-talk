using Dapr.Actors.Runtime;
using Microsoft.Extensions.Logging;
using Microsoft;
using Dapr.Actors;
using System.Transactions;
using AzIsdDapr.Common.Signalr.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace AzIsdDapr.Common.Dapr.Actors
{
    public class BankAccountActor : Actor, IBankAccount
    {
        const string ACCOUNT_STATE = nameof(ACCOUNT_STATE);
        const string TRANSACTION_TIMER = nameof(TRANSACTION_TIMER);

        private readonly ILogger<BankAccountActor> logger;
        private AccountState? accountState;
        private readonly IHubContext<BankUIHub, IDaprBankUiListener> hubContext;

        public BankAccountActor(
            ActorHost host,
            ILogger<BankAccountActor> logger,
            IHubContext<BankUIHub, IDaprBankUiListener> hubContext) : base(host)
        {
            this.logger = logger;
            this.hubContext = hubContext;
        }

        public async Task AddTransaction(decimal depositAmount)
        {
            if (accountState == null)
            {
                var errorMessage = $"{this.LogPrefix}- Could not find state {ACCOUNT_STATE}.";
                this.logger.LogError(errorMessage);
                throw new InvalidOperationException(errorMessage);
            }

            var transaction = new Transaction
            {
                Id = $"{Guid.NewGuid()}",
                Amount = depositAmount,
                CreatedUtc = DateTimeOffset.UtcNow,
                TransactionState = TransactionState.Processing,
            };

            accountState.Transactions.Add(transaction);
            await this.SaveAccountState();
        }

        private async Task<AccountState> GetAccountState() => await this.StateManager.GetStateAsync<AccountState>(ACCOUNT_STATE);

        private async Task SaveAccountState()
        {
            Assumes.NotNull(accountState);
            await this.StateManager.SetStateAsync<AccountState>(ACCOUNT_STATE, accountState);
            this.logger.LogInformation($"{this.LogPrefix}- Successfully persisted {ACCOUNT_STATE}.");
            await this.NotifyBankAccountUpdated();
        }

        private async Task NotifyBankAccountUpdated()
        {
            await this.hubContext.Clients.All.BankAccountUpdated(this.accountState);
        }

        private async Task RegisterTransactionTimerAsync()
        {
            await this.RegisterTimerAsync(
                TRANSACTION_TIMER,
                nameof(this.TransactionTimerCallBack),
                null,
                TimeSpan.FromSeconds(3),
                TimeSpan.FromSeconds(3));
        }

        private async Task TransactionTimerCallBack(byte[] data)
        {
            this.logger.LogInformation($"{this.LogPrefix}- Checking OutStanding Transactions.");

            if (accountState == null)
            {
                var errorMessage = $"{this.LogPrefix}- Could not find state {ACCOUNT_STATE}.";
                this.logger.LogError(errorMessage);
                throw new InvalidOperationException(errorMessage);
            }

            var transaction = this.accountState.Transactions
                .OrderBy(transaction => transaction.CreatedUtc)
                .FirstOrDefault(transaction => transaction.TransactionState == TransactionState.Processing);

            if (transaction == null)
            {
                this.logger.LogInformation($"{this.LogPrefix}- No outstanding transactions to process.");
                return;
            }

            Assumes.NotNull(transaction);

            this.logger.LogInformation($"{this.LogPrefix}- Start processing Transaction {transaction.Id} for amount {transaction.Amount}.");
            accountState.Balance += transaction.Amount;
            transaction.ProcessedUtc = DateTimeOffset.UtcNow;
            transaction.TransactionState = TransactionState.Cleared;

            await this.SaveAccountState();
            this.logger.LogInformation($"{this.LogPrefix}- Transaction {transaction.Id} for amount {transaction.Amount} processed successfully.\nAccount balance is now {accountState.Balance}.");
        }

        private string LogPrefix => $"Actor:{nameof(BankAccountActor)} Id:{this.Id}";

        protected override async Task OnActivateAsync()
        {
            await base.OnActivateAsync();
            this.logger.LogInformation($"{this.LogPrefix}- Activating Actor.");
            var defaultBalanceState = new AccountState
            {
                Balance = 1000m,
            };
            this.accountState = await this.StateManager.GetOrAddStateAsync(ACCOUNT_STATE, defaultBalanceState);
            await this.RegisterTransactionTimerAsync();
        }

        protected override Task OnDeactivateAsync()
        {
            this.logger.LogInformation($"{this.LogPrefix}- Deactivating Actor.");
            return base.OnDeactivateAsync();
        }
    }

    public interface IBankAccount : IActor
    {
        Task AddTransaction(decimal depositAmount);
    }

    public record AccountState
    {
        public AccountState()
        {
            Transactions = Enumerable.Empty<Transaction>().ToList();
        }

        public decimal Balance { get; set; }
        public List<Transaction> Transactions { get; set; }
    }

    public record Transaction
    {
        public string Id { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTimeOffset CreatedUtc { get; set; }
        public DateTimeOffset? ProcessedUtc { get; set; }
        public TransactionState TransactionState { get; set; }
    }

    public enum TransactionState
    {
        Processing = 1,
        Cleared = 2,
        Failed = 3
    }
}
