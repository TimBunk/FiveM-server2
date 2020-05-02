fx_version 'bodacious'
game 'gta5'

author 'Tim Bunk'
description 'The purpose of this script is to simplify the use of input'
version '1.0.0'

client_scripts {
    'client/config.lua',
    'client/client.lua',
}

exports {
  'IsJustPressed',
  'IsJustReleased',
  'IsPressed',
  'IsReleased'
}
