FROM node:20-alpine as nodebase

WORKDIR /src
# Assume that the docker build context is the ./src directory of the repo
COPY ./AzIsdDapr ./AzIsdDapr/
COPY ./AzIsdDaprUi ./AzIsdDaprUi/

RUN cd ./AzIsdDaprUi && npm ci && npm run dev

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /srcbuild
COPY --from=nodebase /src/AzIsdDapr/AzIsdDapr.ClientApi .
RUN dotnet restore "AzIsdDapr.ClientApi.csproj"
RUN dotnet build "AzIsdDapr.ClientApi.csproj" -c Release -o /app/build


FROM build AS publish
RUN dotnet publish "AzIsdDapr.ClientApi.csproj" -c Release -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AzIsdDapr.ClientApi.dll"]

