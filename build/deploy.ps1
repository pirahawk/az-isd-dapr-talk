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

 az deployment group create -g $azGroupName -n $azDeploymentName -f $PSScriptRoot\bicep\deployAppDependencies.bicep `
 --parameters `
 randomSuffix="$randomizationGuid" `
 userPrincipalId="$userAdId"