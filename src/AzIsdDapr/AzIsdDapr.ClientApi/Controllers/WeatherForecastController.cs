using AzIsdDapr.Common.Dapr.Actors;
using Dapr.Actors;
using Dapr.Actors.Client;
using Microsoft.AspNetCore.Mvc;

namespace AzIsdDapr.ClientApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IActorProxyFactory actorProxyFactory;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IActorProxyFactory actorProxyFactory)
        {
            _logger = logger;
            this.actorProxyFactory = actorProxyFactory;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> GetWeatherForecast()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("DoTest", Name = "DoTest")]
        public async Task<IActionResult> TestActorInvoke()
        {
            var actorType = nameof(BankAccountActor);
            var actorId = new ActorId($"BA123");
            var proxy = this.actorProxyFactory.CreateActorProxy<IBankAccount>(actorId, actorType);
            await proxy.AddTransaction(123m);

            return Ok();
        }
    }
}
