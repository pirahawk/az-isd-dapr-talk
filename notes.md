To build and run locally

```
docker build -t azisddaprclient:latest -f .\build\client.dockerfile .\src

docker run --rm -d -p 7285:443 -p 5285:80 -e ASPNETCORE_URLS="http://+" azisddaprclient:latest -n myazisddaprclient

docker build -t azisddaprserver:latest -f .\build\server.dockerfile .\src

docker run --rm -d -p 7286:443 -p 5286:80 -e ASPNETCORE_URLS="http://+" azisddaprserver:latest -n myazisddaprclient

```


To pull and run from the github workflow package builds

```
docker pull ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprclient:latest

docker run --rm -d -p 7285:443 -p 5285:80 -e ASPNETCORE_URLS="http://+" ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprclient:latest -n myazisddaprclient

docker pull ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprserver:latest

docker run --rm -d -p 7286:443 -p 5286:80 -e ASPNETCORE_URLS="http://+" ghcr.io/pirahawk/az-isd-dapr-talk/azisddaprserver:latest -n myazisddaprserver
```