using AzIsdDapr.Common.Config;
using Dapr.Client;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AzIsdDapr.Common.Signalr.Hubs
{
    public class MessageChatHub : Hub<IDaprClientChatListeners>
    {
        private readonly DaprClient daprClient;
        private readonly IOptions<PubSubOptions> daprPubSubOptions;
        private readonly ILogger<MessageChatHub> logger;

        public MessageChatHub(
            DaprClient daprClient,
            IOptions<PubSubOptions> daprPubSubOptions,
            ILogger<MessageChatHub> logger)
        {
            this.daprClient = daprClient;
            this.daprPubSubOptions = daprPubSubOptions;
            this.logger = logger;
        }

        public async Task SendChatMessage(string name, string message)
        {
            var connId = this.Context.ConnectionId;
            var userId = this.Context.UserIdentifier;
            this.logger.LogInformation($"Received Signalr message from {connId}: {name} - {message}");

            var options = this.daprPubSubOptions.Value;
            var notifyMessage = $"{name} - {message}";
            await this.daprClient.PublishEventAsync(options.Name, options.Topic, notifyMessage);

            await Clients.All.NotifySendTextMessage($"{name} - {message}");
        }
    }
}
