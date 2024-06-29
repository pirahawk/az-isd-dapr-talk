Met Office and Microsoft join forces to build world’s most powerful weather and climate forecasting supercomputer in UK


https://news.microsoft.com/en-gb/2021/04/22/met-office-and-microsoft-join-forces-to-build-worlds-most-powerful-weather-and-climate-forecasting-supercomputer-in-uk/



The Met Office has signed a multimillion-pound agreement with Microsoft for the provision of a world-leading supercomputing capability that will take weather and climate forecasting to the next level and help the UK stay safe and thrive.

This new supercomputer – expected to be the world’s most advanced dedicated to weather and climate – will be in the top 25 supercomputers in the world and be twice as powerful as any other in the UK.



Provision a world-leading supercomputer dedicated to weather and climate.
Will be in the top 25 supercomputers in the world - twice as powerful as any other in the UK.




https://dapr.io/



# Ignore Below -Rough work only

```
From the Monitor logs:

// Query to display the different container images running

ContainerAppConsoleLogs_CL 
| order by _timestamp_d asc
//| where ContainerName_s startswith "daprd"
| summarize count() by ContainerName_s, ContainerId_s, ContainerImage_s, ContainerGroupName_s


// Query For Chat Messages

// Client
ContainerAppConsoleLogs_CL 
| order by _timestamp_d asc
| where Log_s  contains "PublishEvent"


// Query for Actors

ContainerAppConsoleLogs_CL 
| order by _timestamp_d asc
| where Log_s  contains "bankaccountactor"
| project _timestamp_d, ContainerName_s, Log_s




App Insights:

// Chat Demo
Client:
POST /dapr.proto.runtime.v1.Dapr/PublishEvent

(If you send message through swagger, search for this): POST Message/SendMessageToTopic

Server: 
Message/RecieveMessageFromTopic





/// Bank Demo

For Actor Logic

Client: POST Bank/AddTransaction


Server:
PUT /v1.0/actors/BankAccountActor/BA123/state
PUT /actors/BankAccountActor/BA123/method/timer/TRANSACTION_TIMER




///////////////////////////////////// OLD RESEARCH

Publish operation failed: the Dapr endpoint indicated a failure. See InnerException for details. Status(StatusCode="Internal", Detail="error when publish to topic orders in pubsub orderpubsub: failed to create a sender: could not get topic orders: ChainedTokenCredential authentication failed
GET http://localhost:42356/msi/token
--------------------------------------------------------------------------------
RESPONSE 400 Bad Request
--------------------------------------------------------------------------------
{
  "statusCode": 400,
  "message": "No User Assigned or Delegated Managed Identity found for specified ClientId/ResourceId/PrincipalId.",
  "correlationId": "14832f9f-9eb0-4041-8886-6204aeb86290"
}
--------------------------------------------------------------------------------
") 


https://portal.azure.com/#blade/AppInsightsExtension/DetailsV2Blade/DataModel/%7B%22eventId%22:%22b3d99859-2039-11ee-a66c-000d3a0b5a94%22,%22timestamp%22:%222023-07-11T22:23:20.2241688Z%22%7D/ComponentId/%7B%22Name%22:%22aif415bc222949%22,%22ResourceGroup%22:%22az-container-apps-f415bc222949%22,%22SubscriptionId%22:%22533ac12b-9c09-49f9-bb99-13264db32b2f%22%7D



/subscriptions/533ac12b-9c09-49f9-bb99-13264db32b2f/resourceGroups/az-container-apps-f415bc222949/providers/Microsoft.ManagedIdentity/userAssignedIdentities/containerAppIdentityf415bc222949








ContainerAppConsoleLogs_CL
| order by _timestamp_d asc
| where ContainerName_s startswith "daprd"
| project  Log_s


ContainerAppConsoleLogs_CL
| where ContainerName_s == 'dapractorclient'
| order by _timestamp_d asc
| project  Log_s


ContainerAppConsoleLogs_CL
| where ContainerName_s == 'dapractorserver'
| order by _timestamp_d asc
| project  Log_s


ContainerAppSystemLogs_CL
| where ContainerAppName_s startswith "dapractorclient"
| order by _timestamp_d asc
| project  Log_s


AppRequests 
| where Name != "GET /health" and Name != "GET /healthz"








az group list --query [].name

az group delete --name az-container-apps-f415bc222959 --no-wait -y

az containerapp list -g az-container-apps-f415bc222959 --query [].name
az containerapp identity show --name daprpubapif415bc222959 --resource-group az-container-apps-f415bc222959
az containerapp revision list -n daprpubapif415bc222959 -g az-container-apps-f415bc222959 --query [].name

az containerapp revision restart -n daprpubapif415bc222959 -g az-container-apps-f415bc222959 --revision daprpubapif415bc222949--eftmia0

daprpubapif415bc222949
daprpubapif415bc222949--eftmia0

az servicebus namespace list -g az-container-apps-f415bc222959
az servicebus topic list -g az-container-apps-f415bc222959 --namespace-name servicebusnsf415bc222959




/subscriptions/533ac12b-9c09-49f9-bb99-13264db32b2f/resourcegroups/az-container-apps-f415bc222959/providers/Microsoft.ManagedIdentity/userAssignedIdentities/containerAppIdentityf415bc222949

servicebusnsf415bc222959.servicebus.windows.net

a214feb5-e842-4167-9592-9e4d4d327899

https://servicebusnsf415bc222959.servicebus.windows.net/orders


az cosmosdb list -g az-container-apps-f415bc222959

az cosmosdb database list --name cosmosdbaccountf415bc222959 --resource-group-name az-container-apps-f415bc222959

az cosmosdb sql database list -a cosmosdbaccountf415bc222959 -g az-container-apps-f415bc222959


az containerapp revision list -n dapractorserverf415bc222959 -g az-container-apps-f415bc222959 --query [].name
az containerapp revision restart -n dapractorserverf415bc222959 -g az-container-apps-f415bc222959 --revision dapractorserverf415bc222959--nc48o1c

az containerapp revision list -n dapractorclientf415bc222959 -g az-container-apps-f415bc222959 --query [].name
az containerapp revision restart -n dapractorclientf415bc222959 -g az-container-apps-f415bc222959 --revision dapractorclientf415bc222959--a92efaa




ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_mytest

az sshkey create --location "uksouth" --resource-group "az-vm-b778fbcf-08e5-4a99-9a3b-6974b95bef37" --name "myvmsshkeyb778fbcf-08e5-4a99-9a3b-6974b95bef37" --public-key "@~/.ssh/id_rsa_mytest.pub"



ssh-keygen -t rsa -b 4096 -f C:\Users\pirantata\Documents\projects\.ssh\id_rsa_mytest

az sshkey create --location "uksouth" --resource-group "az-vm-b778fbcf-08e5-4a99-9a3b-6974b95bef37" --name "myvmsshkeyb778fbcf-08e5-4a99-9a3b-6974b95bef37" --public-key "@C:\Users\pirantata\Documents\projects\.ssh\id_rsa_mytest.pub"
```
