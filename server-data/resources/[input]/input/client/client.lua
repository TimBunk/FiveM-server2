
function IsJustPressed(control, inputGroup)
  inputGroup = inputGroup or 0
  return IsControlJustPressed(inputGroup, control)
end

function IsJustReleased(control, inputGroup)
  inputGroup = inputGroup or 0
  return IsControlJustReleased(inputGroup, control)
end

function IsPressed(control, inputGroup)
  inputGroup = inputGroup or 0
  return IsControlPressed(inputGroup, control)
end

function IsReleased(control, inputGroup)
  inputGroup = inputGroup or 0
  return IsControlReleased(inputGroup, control)
end
