using AzIsdDapr.Common.Config;
using AzIsdDapr.Common.Signalr.Hubs;
using Dapr.Actors.Client;
using Microsoft.Extensions.Configuration;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets(Assembly.GetExecutingAssembly(), true);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddOptions<PubSubOptions>().BindConfiguration("Dapr:PubSub");

builder.Services.AddHealthChecks();
builder.Services
.AddControllers()
.AddDapr();

// Register Dapr Actors Proxy
builder.Services.AddTransient<IActorProxyFactory>(serviceProvider =>
{
    var logger = serviceProvider.GetService<ILogger<IActorProxyFactory>>();
    var configurationRoot = serviceProvider.GetService<IConfiguration>();
    // Note: For the Actors Proxy to work, you need to know the URL (mainly the Dapr Sidecar PORT number)
    // of the target Dapr Sidecar that hosts the app that contains the Actors defined within.
    // You must always point to the Dapr sidecar in the url, not the Apps hosted url:port.

    //var daprApiSidecarPort = configurationRoot?.GetValue<int?>("Dapr:ApiSidecarPort");
    //var daprApiSidecarHostName = configurationRoot?.GetValue<string?>("Dapr:ApiSidecarHostName");
    //var daprApiSidecarScheme = configurationRoot?.GetValue<string?>("Dapr:ApiSidecarScheme");

    //var daprActorUrl = $"{daprApiSidecarScheme}://{daprApiSidecarHostName}:{daprApiSidecarPort}";


    //if (daprApiSidecarPort == null)
    //{
    //    var message = $"IActorProxyFactoryInvocation: Unable to bind to configuration setting: Dapr:ApiSidecarPort";
    //    logger?.LogError(message);
    //    throw new ArgumentException(message);
    //}

    //if (string.IsNullOrWhiteSpace(daprApiSidecarHostName))
    //{
    //    var message = $"IActorProxyFactoryInvocation: Unable to bind to configuration setting: Dapr:ApiSidecarHostName";
    //    logger?.LogError(message);
    //    throw new ArgumentException(message);
    //}

    //if (string.IsNullOrWhiteSpace(daprApiSidecarScheme))
    //{
    //    var message = $"IActorProxyFactoryInvocation: Unable to bind to configuration setting: Dapr:ApiSidecarScheme";
    //    logger?.LogError(message);
    //    throw new ArgumentException(message);
    //}

    //logger?.LogInformation($"IActorProxyFactoryInvocation: Actor proxy URL created for {daprActorUrl}");

    var daprActorUrl = $"{"http"}://{"localhost"}:{65295}";

    var proxyOptions = new ActorProxyOptions
    {
        HttpEndpoint = daprActorUrl,
    };

    return new ActorProxyFactory(proxyOptions);
});

builder.Services.AddActors(configure =>
{


});

// Add Signalr
if (!string.IsNullOrWhiteSpace(builder.Configuration.GetValue<string?>("Azure:SignalR:ConnectionString")))
{
    builder.Services.AddSignalR().AddAzureSignalR();
}
else
{
    builder.Services.AddSignalR();
}

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationInsightsTelemetry();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

//app.UseAuthorization();

app.UseStaticFiles();
app.UseRouting();
app.MapControllers();
app.MapHealthChecks("/health");

// signalr hub map
app.MapHub<MessageChatHub>("/hub/chat");

app.Run();
