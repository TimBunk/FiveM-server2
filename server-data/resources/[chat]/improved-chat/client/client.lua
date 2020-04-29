RegisterNetEvent("cs:improved-chat:addMessage")

local isPauseMenuActive = false

function OpenChat()
  SetNuiFocus(true, false)
  SendNUIMessage({
      type = 'open'
  });
end

function HideChat()
  SendNUIMessage({
      type = 'close'
  });
end

function SendMessage(msg, ctgry)
  print("SEND")
  SendNUIMessage({
      type = 'message',
      message = msg,
      category = ctgry
  });
end

AddEventHandler("cs:improved-chat:addMessage", function(message, ctgry)
  SendMessage(message, ctgry)
end)

RegisterNUICallback('CloseNUI', function(data)
    -- POST data gets parsed as JSON automatically
    local message = data.message
    if message ~= "" then
      -- If the message starts with a '/' that means the user is trying to execute a command
      if string.sub(message, 1, 1) == "/" then
        TriggerEvent("cs:improved-chat:executeCommand", message)
      -- If the input has more then a 100 charachters give a error
      elseif string.len(message) > 100 then
        SendMessage("Message is too long", "error")
      else
        TriggerServerEvent("ss:improved-chat:sendMessage", message)
      end
    end
    SetNuiFocus(false, false)
end)

Citizen.CreateThread(function()
  SetTextChatEnabled(false)
  SetNuiFocus(false, false)

  while true do

    if not IsPauseMenuActive() then
      isPauseMenuActive = false
      -- If the users pressed T then open the chat
      if IsControlJustPressed(0, 245) then
        OpenChat()
      end
    elseif isPauseMenuActive == false then
      isPauseMenuActive = true
      --HideChat()
    end
    Citizen.Wait(0)
  end

end)
