namespace AzIsdDapr.Common.Dapr.Actors
{
    public record Transaction
    {
        public string Id { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string CreatedUtc { get; set; } = string.Empty;
        public string? ProcessedUtc { get; set; }
        public TransactionState TransactionState { get; set; }
    }
}
