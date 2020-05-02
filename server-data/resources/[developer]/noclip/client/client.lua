local noclip = false
local noclipShowCoords = false
local showCoords = false

local speed = 10

local function Cross(forward, up)
  return vector3(
    (forward.y*up.z) - (forward.z*up.y),
    (forward.z*up.x) - (forward.x*up.z),
    (forward.x*up.y) - (forward.y*up.x)
  )
end

local function ShowCoordinates()
  Citizen.CreateThread(function()
    -- Get the player ped
    local player = source
    local ped = GetPlayerPed(player)
    -- Show coordinates until disabled
    while showCoords or noclipShowCoords do
      --print(GetEntityCoords(ped))

      Citizen.Wait(0)
    end

  end)
end

local function StartNoclip()
  Citizen.CreateThread(function()
    -- Enable the coordinates for as long as noclip is running
    noclipShowCoords = true
    if not showCoords then
      ShowCoordinates()
    end

    local ped = PlayerPedId()
    local currentPos = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)

    while noclip do
      local deltaTime = GetFrameTime()

      -- Increase movement speed if the increaseSpeed key is pressed
      if exports.input:IsPressed(Config.increaseMoveSpeed) and Config.moveSpeed < Config.moveMaximumSpeed then
        Config.moveSpeed = Config.moveSpeed + (Config.moveSpeed^Config.moveIncrease * deltaTime)
      end
      -- Decrease movement speed if the decreaseSpeed key is pressed
      if exports.input:IsPressed(Config.decreaseMoveSpeed) and Config.moveSpeed > Config.moveMinimumSpeed then
        Config.moveSpeed = Config.moveSpeed + (-Config.moveSpeed^Config.moveIncrease * deltaTime)
      end
      -- Increase rotate speed if the increaseRotate key is pressed
      if exports.input:IsPressed(Config.increaseRotationSpeed) and Config.rotateSpeed < Config.rotateMaximumSpeed then
        Config.rotateSpeed = Config.rotateSpeed + (Config.rotateSpeed^Config.rotateIncrease * deltaTime)
      end
      -- Decrease rotate speed if the decreaseRotate key is pressed
      if exports.input:IsPressed(Config.decreaseRotationSpeed) and Config.rotateSpeed > Config.rotateMinimumSpeed then
        Config.rotateSpeed = Config.rotateSpeed + (-Config.rotateSpeed^Config.rotateIncrease * deltaTime)
      end

      -- Rotate right if the rotation key is pressed
      if exports.input:IsPressed(Config.rotateRight) then
        heading = heading + (-Config.rotateSpeed * deltaTime)
      end
      -- Rotate left if the rotation key is pressed
      if exports.input:IsPressed(Config.rotateLeft) then
        heading = heading + (Config.rotateSpeed * deltaTime)
      end
      -- Set the rotation
      SetEntityHeading(ped, heading)

      -- Get the forward vector
      local forward = GetEntityForwardVector(ped)
      -- Move forward if the forward key is pressed
      if exports.input:IsPressed(Config.forward) then
        currentPos = currentPos + (-forward * Config.moveSpeed * deltaTime)
      end
      -- Move backward if the backward key is pressed
      if exports.input:IsPressed(Config.backward) then
        currentPos = currentPos + (forward * Config.moveSpeed * deltaTime)
      end
      -- Move left if the left key is pressed
      if exports.input:IsPressed(Config.left) then
        currentPos = currentPos + (Cross(forward, vector3(0,0,1)) * Config.moveSpeed * deltaTime)
      end
      -- Move right if the right key is pressed
      if exports.input:IsPressed(Config.right) then
        currentPos = currentPos + (-Cross(forward, vector3(0,0,1)) * Config.moveSpeed * deltaTime)
      end
      -- Move up if the up key is pressed
      if exports.input:IsPressed(Config.up) then
        currentPos = currentPos + (vector3(0,0,Config.moveSpeed) * deltaTime)
      end
      -- Move down if the down key is pressed
      if exports.input:IsPressed(Config.down) then
        currentPos = currentPos + (-vector3(0,0,Config.moveSpeed) * deltaTime)
      end
      -- Set the position
      SetEntityCoords(ped, currentPos.x, currentPos.y, currentPos.z, false, false, false, true)

      -- Disable stealthmovement while in no clip mode (Stealthmode is usually activted when the user presses lCntrl)
      SetPedStealthMovement(ped, 0, "DEFAULT_ACTION")

      Citizen.Wait(0)
    end
    noclipShowCoords = false
  end)
end

Citizen.CreateThread(function()

  -- NOCLIP COMMAND
  TriggerEvent("cs:improved-chat:addCommand", "noclip", "Enable/disable noclip", {  }, function(...)
    noclip = not noclip
    -- If no clip is enabled, start noclip
    if noclip then
      StartNoclip()
    end
  end)

  -- SHOWCOORDS COMMAND
  TriggerEvent("cs:improved-chat:addCommand", "showcoords", "Enable/disable coordinates", {  }, function(...)
    showCoords = not showCoords
    -- Call the ShowCoordinates function if it is not already running
    if showCoords and not noclipShowCoords then
      ShowCoordinates()
    end
  end)

end)
