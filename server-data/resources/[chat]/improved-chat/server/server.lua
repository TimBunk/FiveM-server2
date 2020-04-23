RegisterNetEvent("ss:improved-chat:sendMessage")

AddEventHandler("ss:improved-chat:sendMessage", function(message, category)
  category = category or 'default'
  TriggerClientEvent("cs:improved-chat:addMessage", -1, message, category)
end)
