var chatArea = document.getElementById("chatArea");
var input = document.getElementById("input");
NeverLoseFocus(input);
CloseChat();

function OpenChat() {
  // Stop the fadeout animation
  $("#chatBackground").stop(true, true);
  // Show the chat
  $("#chatBackground").show();
}

function CloseChat() {
  // Close the chat and chat input
  $("#chatBackground").hide();
  CloseChatInput();
}

function OpenChatInput() {
  // Open the chat input and focus on it
  $("#chatForm").show();
  input.focus();
}

function CloseChatInput() {
  $("#chatForm").hide();
}

function NeverLoseFocus(element) {
  element.focus();
  element.onblur = function() {
    setTimeout(function () {
      element.focus();
    });
  }
}

function AddMessage(message) {
  // Create a new DIV with as class message
  var node = document.createElement("DIV");
  node.className = "message"
  // change the innerHTML to the message we want to display
  node.innerHTML = message;
  // Add the message to the chat
  chatArea.appendChild(node);
  // Scroll down to make sure the latest message is visible
  chatArea.scrollTop = chatArea.scrollHeight;
  // Whenever there are more then 15 messages delete the first one
  if (chatArea.children.length > 15) {
    chatArea.children[0].remove();
  }
}

function CloseNUI(_message) {
  // Send the message to the client.lua script
  fetch(`https://${GetParentResourceName()}/CloseNUI`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
          message: _message
      })
  });
}

function FadeOut(delay) {
  $(document).ready(function() {
    $("#chatBackground").fadeOut(delay);
  });
}

document.onkeypress = function (data) {
  // If the enter key is pressed
  if (data.which == 13) {
    // Remove any whitespaces from the beginning or end of the input
    var inputValue = input.value.trim();
    // Removes any extra spaces between words
    inputValue = inputValue.replace(/\s{2,}/g, ' ')
    // Clear the input.value
    input.value = "";
    // Close the chat input
    CloseChatInput();
    // if message is empty fade the chat away
    if (inputValue == "") {
      CloseChat();
    }
    // Close the NUI and send the input to lua
    CloseNUI(inputValue);
  }
};

window.addEventListener('message', (event) => {
  switch (event.data.type) {
    case 'open':
      OpenChat();
      OpenChatInput();
      break;
    case 'close':
      CloseChat();
      break;
    case 'message':
      AddMessage(event.data.message);
      break;
    case 'fadeOut':
      OpenChat();
      FadeOut(event.data.delay);
      break;
  }
});
