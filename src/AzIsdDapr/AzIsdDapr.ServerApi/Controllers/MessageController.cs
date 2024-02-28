using AzIsdDapr.Common.Signalr.Hubs;
using Dapr;
using Microsoft;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace AzIsdDapr.ServerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<MessageChatHub, IDaprClientChatListeners> hubContext;
        private readonly ILogger<MessageController> _logger;

        public MessageController(
            IHubContext<MessageChatHub, IDaprClientChatListeners> hubContext,
            ILogger<MessageController> logger)
        {
            Requires.NotNull(hubContext);
            Requires.NotNull(logger);

            this.hubContext = hubContext;
            this._logger = logger;
        }

        [HttpPost(Name = "Send")]
        [Topic("messagingpubsub", "messagepubtopic")]
        public async Task<IActionResult> RecieveMessageFromTopic([FromBody] string message)
        {
            _logger.LogInformation($"Recieved Message: {message}");
            await hubContext.Clients.All.NotifySendTextMessage(message).ConfigureAwait(false);
            return await Task.FromResult(Ok(message));
        }
    }
}
