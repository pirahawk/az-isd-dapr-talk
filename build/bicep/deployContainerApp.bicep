param randomSuffix string
var targetLocation = resourceGroup().location

resource containerManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: 'containerAppIdentity${randomSuffix}'
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: 'containerreg${randomSuffix}'
}

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' existing = {
  name: 'cosmosdbaccount${randomSuffix}'
}

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' existing = {
  name: 'cosmosdb${randomSuffix}'
}

resource servicebusNameSpace 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' existing = {
  name: 'servicebusns${randomSuffix}'
}


resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: 'logs${randomSuffix}'
  location: targetLocation
  properties: any({
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
    sku: {
      name: 'PerGB2018'
    }
  })
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ai${randomSuffix}'
  location: targetLocation
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2022-11-01-preview' = {
  name: 'containerappenv${randomSuffix}'
  location: targetLocation

  properties: {
    daprAIInstrumentationKey: appInsights.properties.InstrumentationKey
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource daprComponentActorState 'Microsoft.App/managedEnvironments/daprComponents@2022-06-01-preview' = {
  parent: containerAppEnvironment
  name: 'actor-state-cosmos'
  properties: {
    componentType: 'state.azure.cosmosdb'
    version: 'v1'
    metadata: [
      {
        name: 'masterKey'
        value: cosmosDbAccount.listKeys().secondaryMasterKey
      }

      {
        name: 'url'
        value: cosmosDbAccount.properties.locations[0].documentEndpoint
      }

      {
        name: 'database'
        value: cosmosDbDatabase.name
      }

      {
        name: 'collection'
        value: 'actorstate'
      }

      {
        name: 'actorStateStore'
        value: 'true'
      }
    ]
    scopes: [
      'azisddaprserver'
      'azisddaprclient'
    ]
  }
  dependsOn: [
    // containerAppEnvironment
  ]
}

resource daprComponentPubsub 'Microsoft.App/managedEnvironments/daprComponents@2022-06-01-preview' = {
  parent: containerAppEnvironment
  name: 'orderpubsub'
  properties: {
    componentType: 'pubsub.azure.servicebus'
    version: 'v1'
    metadata: [
      {
        name: 'azureClientId'
        value: containerManagedIdentity.properties.clientId
      }
      {
        name: 'namespaceName'
        value: '${servicebusNameSpace.name}.servicebus.windows.net'
      }
      {
        name: 'consumerID'
        value: 'orders' // Set to the same value of the subscription seen in ./servicebus.bicep
      }
    ]
    scopes: [
      'azisddaprserver'
      'azisddaprclient'
    ]
  }
  dependsOn: [
    // containerAppEnvironment
  ]
}

// var daprServerContainerImageToUse = '${containerRegistry.properties.loginServer}/azdapractorserver:latest'
// var daprClientContainerImageToUse = '${containerRegistry.properties.loginServer}/azdapractorclient:latest'

var daprServerContainerImageToUse = 'ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprserver:latest'
var daprClientContainerImageToUse = 'ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprclient:latest'

resource daprActorServerApp 'Microsoft.App/containerApps@2022-06-01-preview' = {
  name: 'dapractorserver${randomSuffix}'
  location: targetLocation
  dependsOn: [
    daprComponentActorState
  ]
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${containerManagedIdentity.id}': {}
    }
  }
  properties: {
    
    environmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        targetPort: 8080
        external: true
        transport:'auto'
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: containerManagedIdentity.id
        }
      ]
      dapr:{
        enabled: true
        appId: 'azisddaprserver'
        appProtocol: 'http'
        appPort: 8080
        enableApiLogging: true
        logLevel: 'debug'
      }
    }
    template: {
      containers: [
        {
          image: daprServerContainerImageToUse
          name: 'dapractorserver'
          resources: {
            cpu: 1
            memory: '2Gi'
          }
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Development'
            }
            {
              name: 'ASPNETCORE_URLS'
              value: 'http://+:8080'
            }
            {
              name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
              value: appInsights.properties.InstrumentationKey
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: appInsights.properties.ConnectionString
            }
            {
              name: 'ApiOptions__ItemName'
              value: 'AppServiceItem'
            }
          ]
          probes:[
            {
              httpGet: {
                path: '/health'
                port: 8080
              }
              initialDelaySeconds:5
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
  }
}


resource daprActorClientApp 'Microsoft.App/containerApps@2022-06-01-preview' = {
  name: 'dapractorclient${randomSuffix}'
  location: targetLocation
  dependsOn: [
    daprComponentActorState
  ]
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${containerManagedIdentity.id}': {}
    }
  }
  properties: {
    
    environmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        targetPort: 8080
        external: true
        transport:'auto'
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: containerManagedIdentity.id
        }
      ]
      dapr:{
        enabled: true
        appId: 'azisddaprclient'
        appProtocol: 'http'
        appPort: 8080
        enableApiLogging: true
        logLevel: 'debug'
      }
    }
    template: {
      containers: [
        {
          image: daprClientContainerImageToUse
          name: 'dapractorclient'
          resources: {
            cpu: 1
            memory: '2Gi'
          }
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Development'
            }
            {
              name: 'ASPNETCORE_URLS'
              value: 'http://+:8080'
            }
            {
              name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
              value: appInsights.properties.InstrumentationKey
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: appInsights.properties.ConnectionString
            }
            {
              name: 'ApiOptions__ItemName'
              value: 'AppServiceItem'
            }
            {
              name: 'Dapr__ApiSidecarPort'
              value: '3500'
            }
            {
              name: 'Dapr__ApiSidecarHostName'
              value: 'localhost'
            }
            {
              name: 'Dapr__ApiSidecarScheme'
              value: 'http'
            }
          ]
          probes:[
            {
              httpGet: {
                path: '/health'
                port: 8080
              }
              initialDelaySeconds:5
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
  }
}
