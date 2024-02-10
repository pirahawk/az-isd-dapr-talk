using Dapr;
using Microsoft;
using Microsoft.AspNetCore.Mvc;

namespace AzIsdDapr.ServerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly ILogger<MessageController> _logger;

        public MessageController(
            ILogger<MessageController> logger)
        {
            Requires.NotNull(logger);
            _logger = logger;
        }

        [HttpPost(Name = "Send")]
        [Topic("orderpubsub", "orders")]
        public async Task<IActionResult> RecieveMessageFromTopic([FromBody] string message)
        {
            _logger.LogInformation($"Recieved Message: {message}");
            return await Task.FromResult(Ok(message));
        }
    }
}
