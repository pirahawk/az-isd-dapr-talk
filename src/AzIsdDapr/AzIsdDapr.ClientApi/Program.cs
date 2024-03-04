using AzIsdDapr.Common.Config;
using AzIsdDapr.Common.Signalr.Hubs;
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
