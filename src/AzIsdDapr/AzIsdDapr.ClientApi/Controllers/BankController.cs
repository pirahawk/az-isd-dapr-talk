using AzIsdDapr.Common.Dapr.Actors;
using Dapr.Actors;
using Dapr.Actors.Client;
using Microsoft.AspNetCore.Mvc;

namespace AzIsdDapr.ClientApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BankController : ControllerBase
    {
        const string BankId = "BA123";
        private readonly IActorProxyFactory actorProxyFactory;
        private readonly ILogger<BankController> logger;

        public BankController(IActorProxyFactory actorProxyFactory, ILogger<BankController> logger)
        {
            this.actorProxyFactory = actorProxyFactory;
            this.logger = logger;
        }

        [HttpPost("Start", Name = "StartActor")]
        public async Task<IActionResult> StartActor()
        {
            IBankAccount proxy = CreateActorProxy();
            await proxy.StartBankAccountAsync();
            return Ok();
        }

        [HttpPost("Transaction", Name = "AddTransaction")]
        public async Task<IActionResult> AddTransaction([FromBody]int transactionAmount)
        {
            if(transactionAmount == 0) {
                return BadRequest();
            }

            IBankAccount proxy = CreateActorProxy();
            await proxy.AddTransactionAsync(transactionAmount);
            return Ok();
        }

        private IBankAccount CreateActorProxy()
        {
            var actorType = nameof(BankAccountActor);
            var actorId = new ActorId(BankId);
            var proxy = this.actorProxyFactory.CreateActorProxy<IBankAccount>(actorId, actorType);
            return proxy;
        }

    }
}
