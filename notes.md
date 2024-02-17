# To build and run locally

```
docker build -t azisddaprclient:latest -f .\build\client.dockerfile .\src

docker run --rm -d -p 7285:443 -p 5285:80 -e ASPNETCORE_URLS="http://+" azisddaprclient:latest -n myazisddaprclient

docker build -t azisddaprserver:latest -f .\build\server.dockerfile .\src

docker run --rm -d -p 7286:443 -p 5286:80 -e ASPNETCORE_URLS="http://+" azisddaprserver:latest -n myazisddaprserver

```


# To pull and run from the github workflow package builds

```
docker pull ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprclient:latest

docker run --rm -d -p 7285:443 -p 5285:80 -e ASPNETCORE_URLS="http://+" ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprclient:latest -n myazisddaprclient

docker pull ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprserver:latest

docker run --rm -d -p 7286:443 -p 5286:80 -e ASPNETCORE_URLS="http://+" ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprserver:latest -n myazisddaprserver
```


# Useful notes about docker build updates:
https://docs.github.com/en/actions/publishing-packages/publishing-docker-images
https://docs.github.com/en/actions/security-guides/automatic-token-authentication
https://github.com/docker/build-push-action?tab=readme-ov-file#inputs


```
dapr run --app-id isd-server-api --dapr-http-port 65295 --app-port 5280 --components-path ".\local-az-dapr-components" -- dotnet run --project .\src\AzIsdDapr\AzIsdDapr.ServerApi\AzIsdDapr.ServerApi.csproj

dapr run --app-id isd-client-api --dapr-http-port 64441 --app-port 5001 --components-path ".\local-az-dapr-components" -- dotnet run --project .\src\AzIsdDapr\AzIsdDapr.ClientApi\AzIsdDapr.ClientApi.csproj
```