namespace AzIsdDapr.Common.Dapr.Actors
{
    public record AccountState
    {
        public AccountState()
        {
            Transactions = Enumerable.Empty<Transaction>().ToList();
        }

        public decimal Balance { get; set; }
        public List<Transaction> Transactions { get; set; }
    }
}
