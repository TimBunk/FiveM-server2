var displayCommand = false;
var chatArea = document.getElementById("chatArea");
var input = document.getElementById("input");

$( document ).ready(function() {
    $("#commandArgs").hide();
});

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

function AddMessage(message, category) {
  // Create a new DIV with as class message
  var node = document.createElement("DIV");
  node.className = "message";
  // Set the color
  AddColor(node, category);
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
  // Fade the chat away after receiving the message
  FadeOut();
}

function AddColor(node, category) {
  switch (category) {
    case 'default':
      node.style.color = "#FFFFFF";
      break;
    case 'error':
      node.style.color = "#FF0000";
      break;
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

function FadeOut() {
  $(document).ready(function() {
    $("#chatBackground").fadeOut(fadeOutDuration);
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
    /*if (inputValue == "") {
      FadeOut(3000);
    }*/
    FadeOut();
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
      OpenChat();
      FadeOut();
      AddMessage(event.data.message, event.data.category);
      break;
    case 'fadeOut':
      OpenChat();
      FadeOut();
      break;
    case 'command':
      AddCommand(event.data);
      break;
  }
});

var commands = [
  {
    value: "/tp",
    label: "/tp x y z",
    desc: "Telport to coordinates",
    args: [["x", "x coordinate"], ["y", "y coordinate"], ["z", "z coordinate"]]
  },
  {
    value: "/tp",
    label: "/tp player",
    desc: "Telport to player",
    args: [["player", "playerID"]]
  }
];

function AddCommand(data) {
  console.log("Adding command: " + data.value);
  commands.push(
    {
      value: data.value,
      label: data.label,
      desc: data.description,
      args: data.args
    }
  );
}

/**********************************************
        AUTOCOMPLETE
**********************************************/

$( function() {

  $( "#input" ).autocomplete({
    minLength: 1,
    source: commands,
    focus: function( event, ui ) {
      $( "#input" ).val( ui.item.value );
      return false;
    },
    select: function( event, ui ) {
      $( "#input" ).val( ui.item.value );
      $( "#command-id" ).val( ui.item.value );
      DisplayItem(ui.item);
      return false;
    }
  })
  .autocomplete( "instance" )._renderItem = function( ul, item ) {
    var inputVal = $("#input").val();
    if (inputVal.charAt(inputVal.length-1) != " " && displayCommand == false) {
      return $( "<li>" )
        .append( "<div>" + item.desc + "<br>" + item.label + "</div>" )
        .appendTo(ul);
    }
  };
} );

var item = null;
input.addEventListener('input', InputChange);

function InputChange() {
  if (displayCommand === true) {
    // Get the current input value
    var inputValue = $("#input").val();
    // Removes any extra spaces between words
    inputValue = inputValue.replace(/\s{2,}/g, ' ')
    // Create a array of the input value
    var inputValues = inputValue.split(" ");
    // Clear the arg text
    $("#arg").text("");
    // Check if the typed command is still in the input value
    if (inputValues[0] === item.value) {
      // Set the label text
      var labelText = item.value;
      for (var i = 0; i < item.args.length; i++) {
        // Highlight the current argument the user is typing
        if (inputValues.length-2 == i) {
          labelText += (" <text style='color: rgba(128, 255, 128, 1.0);'><b>" + item.args[i][0] + "</b></text>");
          $("#arg").text(item.args[i][1]);
        }
        // Set the argument in the label
        else { labelText += (" " + item.args[i][0]); }
      }
      // Apply the label
      $("#label").html(labelText);
    }
    else {
      // Disable the information about the command
      displayCommand = false;
      $("#commandArgs").hide();
    }

  }
}

function DisplayItem(_item) {
  // Display the information of a command
  item = _item;
  displayCommand = true;
  $("#commandArgs").show();
  $("#description").text(item.desc);
  $("#label").text(item.label);
  InputChange();
}

// When the document is ready notify the improved-chat
$( document ).ready(function() {
    fetch(`https://${GetParentResourceName()}/ReadyNUI`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            ready: true
        })
    });
});
