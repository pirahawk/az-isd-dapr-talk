namespace AzIsdDapr.Common.Dapr.Actors
{
    public record Transaction
    {
        public string Id { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTimeOffset CreatedUtc { get; set; }
        public DateTimeOffset? ProcessedUtc { get; set; }
        public TransactionState TransactionState { get; set; }
    }
}
