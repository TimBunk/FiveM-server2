fx_version 'bodacious'
game 'gta5'

author 'Tim Bunk'
description 'Improved chat'
version '1.0.0'

client_scripts {
    'client/client.lua'
}

server_scripts {
  'server/server.lua'
}

-- specify the root page, relative to the resource
ui_page 'html/main.html'

-- every client-side file still needs to be added to the resource packfile!
files {
    'html/main.html',
    'html/index.css',
    'html/script.js'
}
