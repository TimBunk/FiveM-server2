fx_version 'bodacious'
game 'gta5'

author 'Tim Bunk'
description 'Improved chat'
version '1.0.0'

client_scripts {
    'client/config.lua',
    'client/client.lua',
    'client/commands.lua'
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
    'html/config.js',
    'html/script.js',
    'html/jquery-3.5.0.js',
    'html/jquery-ui.js',
    'html/jquery-ui.css'
}
