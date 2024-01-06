#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["AzIsdDapr.ClientApi/AzIsdDapr.ClientApi.csproj", "AzIsdDapr.ClientApi/"]
RUN dotnet restore "./AzIsdDapr.ClientApi/./AzIsdDapr.ClientApi.csproj"
COPY . .
WORKDIR "/src/AzIsdDapr.ClientApi"
RUN dotnet build "./AzIsdDapr.ClientApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AzIsdDapr.ClientApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AzIsdDapr.ClientApi.dll"]