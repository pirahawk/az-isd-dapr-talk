```
docker build -t azisddaprclient:latest -f .\build\dockerfile .\src

 docker run --rm -d -p 7285:443 -p 5285:80 -e ASPNETCORE_URLS="http://+" azisddaprclient:latest -n myazisddaprclient
```