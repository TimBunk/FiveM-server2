var chatArea = document.getElementById("chatArea");
var input = document.getElementById("input");
NeverLoseFocus(input);

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

document.onkeypress = function (data) {
  // If the enter key is pressed
  if (data.which == 13) {
    // Remove any whitespaces from the beginning or end of the input
    var inputValue = input.value.trim();
    // Removes any extra spaces between words
    inputValue = inputValue.replace(/\s{2,}/g, ' ')
    // Clear the input.value
    input.value = "";
    // Return if the input is empty
    /*if (inputValue == "") {
      // TODO: Some error message
    }
    // If the input has more then a 100 charachters dont post it
    else if (inputValue.length > 100) {
      // TODO: Some error message
    }
    else {
      // Send the message
      AddMessage(inputValue);
    }*/
    // Close the NUI
    CloseNUI(inputValue);
  }
};

window.addEventListener('message', (event) => {
    if (event.data.type === 'open') {
        //FocusInput();
    }
    else if (event.data.type === 'message') {
      console.log("Message received: " + event.data.message);
      AddMessage(event.data.message);
    }
});
