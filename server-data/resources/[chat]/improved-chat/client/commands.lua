RegisterNetEvent("cs:improved-chat:addCommand")
RegisterNetEvent("cs:improved-chat:executeCommand");

local commands = {  }
local nuiReady = false

RegisterNUICallback('ReadyNUI', function(data)
  nuiReady = data.ready
end)

AddEventHandler("cs:improved-chat:addCommand", function(commandName, desc, argumentDescriptions, callback)
  -- Wait for the nui to be ready
  while nuiReady == false do
    Citizen.Wait(0)
  end
  -- Make commandName lower case
  commandName = string.lower(commandName)
  commands[commandName] = callback

  -- Prepare the values for display in html
  local v = ("/" .. commandName)
  local l = v
  argumentDescriptions = argumentDescriptions or {}
  for i=1,#argumentDescriptions do
    l = (l .. " " .. argumentDescriptions[i][1])
  end
  -- Send the values to the javascript
  SendNUIMessage({
      type = 'command',
      value = v,
      label = l,
      description = desc,
      args = argumentDescriptions
  });
end)

AddEventHandler("cs:improved-chat:executeCommand", function(message)
  local length = string.len(message)
  -- Check if the command is not empty
  if length > 1 then
    -- Remove the '/' from the message
    local c = string.sub(message, 2, length)
    -- Split the command in to a table
    local args = {}
    for i in string.gmatch(c, "%S+") do
      print("Arg: " .. i)
       table.insert(args, i)
    end
    -- Get the callback of the command and remove the first name of the command from the table
    local cb = commands[table.remove(args, 1)]
    -- Check if their is a valid callback otherwise the command does not exist
    if cb then
      -- Execute the command
      cb(args)
    else
      -- Command not found so give the user feedback about the non-existing command he tried to execute
      TriggerEvent("cs:improved-chat:addMessage", ("Command '" .. c .. "' not found"), "error")
    end
  end
end)

--[[Citizen.CreateThread(function()
  TriggerEvent("cs:improved-chat:addCommand", "command", "First command", { { "x", "x coord" }, { "y", "y coord"} }, function(...)
    local args = ...
    print("THE COMMAND WAS CALLED, args: ")
    print(args[1])
  end);
end)--]]
