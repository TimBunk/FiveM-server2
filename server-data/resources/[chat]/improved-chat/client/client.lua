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

function SendMessage(msg)
  SendNUIMessage({
      type = 'message',
      message = msg
  });
  FadeOut(msg)
end

function FadeOut(msg)
  local miliseconds = 3000 + string.len(msg) * 50
  SendNUIMessage({
      type = 'fadeOut',
      delay = miliseconds
  });
end

AddEventHandler("cs:improved-chat:addMessage", function(message)
  SendMessage(message)
end)

RegisterNUICallback('CloseNUI', function(data)
    -- POST data gets parsed as JSON automatically
    local message = data.message
    if message == "" then
      -- TODO: Some error message
      print("empty message")
    -- If the input has more then a 100 charachters dont post it
    elseif string.len(message) > 100 then
      -- TODO: Some error message
      print("message too long")
    else
      -- Send the message
      print("Send message: " .. message)
      TriggerServerEvent("ss:improved-chat:sendMessage", message)
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
