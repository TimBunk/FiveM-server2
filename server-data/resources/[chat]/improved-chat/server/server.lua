RegisterNetEvent("ss:improved-chat:sendMessage")

AddEventHandler("ss:improved-chat:sendMessage", function(message)
  TriggerClientEvent("cs:improved-chat:addMessage", -1, message)
end)
