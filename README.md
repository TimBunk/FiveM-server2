# FiveM-server2
FiveM-server with loads of custom scripts
Clone the repository using git bash with the following command:
```
git clone --recursive https://github.com/TimBunk/fivem-server
```

## Instructions
1. Download the latest server artifact from here: https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/
2. Create a folder called 'server' inside the fivem-server folder
3. Extract all files from the server artifact in to the newly created server folder
4. Create a file called config.cfg in the server-data folder
5. Copy and paste everything what is below inside of the config.cfg file
6. Apply the appropriate changes to the file
```
## Only change the IP if you're using a server with multiple network interfaces, otherwise change the port only.
endpoint_add_tcp "0.0.0.0:30120"
endpoint_add_udp "0.0.0.0:30120"

## A string variable that contains the server host name.
sv_hostname "FXServer"

## Steam Web API key, if you want to use Steam authentication (https://steamcommunity.com/dev/apikey)
sv_licenseKey changeMe

## License key for your server (https://keymaster.fivem.net)
set steam_webApiKey "changeMe"
```

## Usefull links
- Git submodules: <https://www.vogella.com/tutorials/GitSubmodules/article.html>
- steam_webApiKey: <https://steamcommunity.com/dev/apikey>
- LicenseKey: <https://keymaster.fivem.net/>
- FiveM documentation: <https://docs.fivem.net/docs/>
- FiveM status: <https://status.fivem.net/>
- FiveM forum: <https://forum.cfx.re/categories>
