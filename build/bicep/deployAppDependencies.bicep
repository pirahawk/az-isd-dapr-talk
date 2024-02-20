param randomSuffix string
param userPrincipalId string
var targetLocation = resourceGroup().location


resource containerManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'containerAppIdentity${randomSuffix}'
  location: targetLocation
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: 'containerreg${randomSuffix}'
  location: targetLocation
  sku: {
    name: 'Standard'
  }
  identity:{
    type:'SystemAssigned'
  }
  properties:{
    adminUserEnabled:false
    anonymousPullEnabled:false
  }
}

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmosdbaccount${randomSuffix}'
  kind: 'GlobalDocumentDB'
  location: targetLocation
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: targetLocation
      }
    ]
  }

  resource cosmosDbDatabase 'sqlDatabases@2023-04-15' = {
    name: 'cosmosdb${randomSuffix}'
    properties: {
      resource: {
        id: 'cosmosdb${randomSuffix}'
      }
    }

    resource daprCosmosActorStateDbContainer 'containers@2022-08-15' = {
      name: 'actorstate'
      properties: {
        options:{
          autoscaleSettings:{
            maxThroughput: 1000
          }
        }
        resource: {
          id: 'actorstate'
          partitionKey:{
            kind: 'Hash'
            paths: [ '/partitionKey' ]
          }
          indexingPolicy:{
            automatic: true
          }
        }
      }
    }

    resource daprCosmosGlobalStateDbContainer 'containers@2022-08-15' = {
      name: 'globalstate'
      properties: {
        options:{
          autoscaleSettings:{
            maxThroughput: 1000
          }
        }
        resource: {
          id: 'globalstate'
          partitionKey:{
            kind: 'Hash'
            paths: [ '/partitionKey' ]
          }
          indexingPolicy:{
            automatic: true
          }
        }
      }
    }

  }
}

resource servicebusNameSpace 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: 'servicebusns${randomSuffix}'
  location: targetLocation
  sku:{
    name:'Standard'
    tier: 'Standard'
  }
  identity:{
    type:'SystemAssigned'
  }
  properties:{
    zoneRedundant: false
  }

  resource messagepubtopic 'topics@2022-10-01-preview' = {
    name: 'messagepubtopic'
    properties:{
      requiresDuplicateDetection:false
      defaultMessageTimeToLive: 'PT10M'
    }

    resource subscription 'subscriptions' = {
      name: 'defaultmessagesub'
      properties: {
        deadLetteringOnFilterEvaluationExceptions: true
        deadLetteringOnMessageExpiration: true
        maxDeliveryCount: 10
      }
    }

  }
}

resource AcrPullRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '7f951dda-4ed3-4680-a7ca-43fe172d538d'
}

// resource CosmosDBContributorRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
//   name: 'b24988ac-6180-42a0-ab88-20f7382dd24c'
// }

resource CosmosDBOwnerRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
}

resource acrPullContainerAppService 'Microsoft.Authorization/roleAssignments@2022-04-01' ={
  name: guid(containerRegistry.id, containerManagedIdentity.name, AcrPullRole.name)
  scope: containerRegistry
  properties:{
    principalId: containerManagedIdentity.properties.principalId
    roleDefinitionId: AcrPullRole.id
    principalType: 'ServicePrincipal'
    description: 'Assigning AcrPull role to containerAppPrincipalId'
  }
}

resource cosmosOwnerContainerAppService 'Microsoft.Authorization/roleAssignments@2022-04-01' ={
  name: guid(cosmosDbAccount.id, containerManagedIdentity.name, CosmosDBOwnerRole.name)
  scope: cosmosDbAccount
  properties:{
    principalId: containerManagedIdentity.properties.principalId
    roleDefinitionId: CosmosDBOwnerRole.id
    principalType: 'ServicePrincipal'
    description: 'CosmosDBOwnerRole'
  }
}


resource ServiceBusContributorRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: 'b24988ac-6180-42a0-ab88-20f7382dd24c'
}

resource ServiceBusDataOwnerRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '090c5cfd-751d-490a-894a-3ce6f1109419'
}

resource ServiceBusSenderRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '69a216fc-b8fb-44d8-bc22-1f3c2cd27a39'
}

resource ServiceBusReceiverRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0'
}

resource sbContributorContainerAppService 'Microsoft.Authorization/roleAssignments@2022-04-01' ={
  name: guid(servicebusNameSpace.id, containerManagedIdentity.name, ServiceBusContributorRole.name)
  scope: servicebusNameSpace
  properties:{
    principalId: containerManagedIdentity.properties.principalId
    roleDefinitionId: ServiceBusContributorRole.id
    principalType: 'ServicePrincipal'
    description: 'ServiceBusContributorRole'
  }
}

resource sbDataOwnerContainerAppService 'Microsoft.Authorization/roleAssignments@2022-04-01' ={
  name: guid(servicebusNameSpace.id, containerManagedIdentity.name, ServiceBusDataOwnerRole.name)
  scope: servicebusNameSpace
  properties:{
    principalId: containerManagedIdentity.properties.principalId
    roleDefinitionId: ServiceBusDataOwnerRole.id
    principalType: 'ServicePrincipal'
    description: 'ServiceBusDataOwnerRole'
  }
}

resource sbSenderContainerAppService 'Microsoft.Authorization/roleAssignments@2022-04-01' ={
  name: guid(servicebusNameSpace.id, containerManagedIdentity.name, ServiceBusSenderRole.name)
  scope: servicebusNameSpace
  properties:{
    principalId: containerManagedIdentity.properties.principalId
    roleDefinitionId: ServiceBusSenderRole.id
    principalType: 'ServicePrincipal'
    description: 'ServiceBusSenderRole'
  }
}

resource sbReceiverContainerAppService 'Microsoft.Authorization/roleAssignments@2022-04-01' ={
  name: guid(servicebusNameSpace.id, containerManagedIdentity.name, ServiceBusReceiverRole.name)
  scope: servicebusNameSpace
  properties:{
    principalId: containerManagedIdentity.properties.principalId
    roleDefinitionId: ServiceBusReceiverRole.id
    principalType: 'ServicePrincipal'
    description: 'ServiceBusReceiverRole'
  }
}
