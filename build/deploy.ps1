Param(
  [parameter(Mandatory=$true)]
  [string] $randomizationGuid,
  [parameter(Mandatory=$true)]
  [string] $azGroupName,
  [parameter(Mandatory=$true)]
  [string] $azDeploymentName,
  [parameter(Mandatory=$true)]
  [string] $userAdId
)

Write-Output "Executing in $PSScriptRoot"
Write-Output "Invoked with $randomizationGuid $azGroupName $azDeploymentName $userAdId"

if($null -eq $(az group show -n $azGroupName)){
    Write-Output "Group $azGroupName does not exist"
    az group create -l 'uksouth' -n $azGroupName    
}else {
    Write-Output "Group $azGroupName exists. Deploying: $azDeploymentName"
}

$dependenciesDeploymentName = "$azDeploymentName-dependencies"
$appDeploymentName = "$azDeploymentName-app"

Write-Output "Executing deployment $dependenciesDeploymentName"
 
az deployment group create -g $azGroupName -n $dependenciesDeploymentName -f $PSScriptRoot\bicep\deployAppDependencies.bicep `
 --parameters `
 randomSuffix="$randomizationGuid" `
 userPrincipalId="$userAdId"

 Write-Output "Executing deployment $appDeploymentName"

 az deployment group create -g $azGroupName -n $appDeploymentName -f $PSScriptRoot\bicep\deployContainerApp.bicep `
 --parameters `
 randomSuffix="$randomizationGuid"