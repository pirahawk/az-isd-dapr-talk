﻿namespace AzIsdDapr.Common.Config
{
    public record PubSubOptions
    {
        public required string Name { get; set; }
        public required string Topic { get; set; }
    }
}
