using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace AzIsdDapr.Common.Signalr.Hubs
{
    public class BankUIHub : Hub<IDaprBankUiListener>
    {
        ILogger<BankUIHub> logger;
        public BankUIHub(ILogger<BankUIHub> logger)
        {
            this.logger = logger;
        }

        public async Task NotifyBankAccountUpdated()
        {
            await Task.CompletedTask;
            //await this.Clients.All.BankAccountUpdated($"{DateTimeOffset.UtcNow} - Bank account updated.");
        }
    }
}
