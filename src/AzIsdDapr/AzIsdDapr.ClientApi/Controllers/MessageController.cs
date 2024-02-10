using AzIsdDapr.ClientApi.Config;
using Dapr.Client;
using Microsoft;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AzIsdDapr.ClientApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly DaprClient daprClient;
        private readonly IOptions<PubSubOptions> daprPubSubOptions;
        private readonly ILogger<MessageController> _logger;

        public MessageController(
            DaprClient daprClient,
            IOptions<PubSubOptions> daprPubSubOptions,
            ILogger<MessageController> logger)
        {
            Requires.NotNull(daprClient);
            Requires.NotNull(daprPubSubOptions);
            Requires.NotNull(logger);

            this.daprClient = daprClient;
            this.daprPubSubOptions = daprPubSubOptions;
            _logger = logger;
        }

        [HttpPost(Name = "Send")]
        public async Task<IActionResult> SendMessageToTopic([FromBody]string message)
        {
            Requires.NotNullOrWhiteSpace(message);

            var options = this.daprPubSubOptions.Value;
            
            await this.daprClient.PublishEventAsync(options.Name, options.Topic, message);

            return await Task.FromResult(Ok());
        }
    }
}
