$( document ).ready(function() {

  var displayCommand = false;
  var input = $("#input");
  var chatBackground = $("#chatBackground");
  var chatForm = $("#chatForm");
  var chatArea = $("#chatArea");

  var historyQueue = [];
  var historyPosition = 0;

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

  $("#commandArgs").hide();

  NeverLoseFocus(input);
  CloseChat();

  function OpenChat() {
    // Stop the fadeout animation
    chatBackground.stop(true, true);
    // Show the chat
    chatBackground.show();
  }

  function CloseChat() {
    // Close the chat and chat input
    chatBackground.hide();
    CloseChatInput();
  }

  function OpenChatInput() {
    // Open the chat input and focus on it
    chatForm.show();
    input.focus();
    historyPosition = historyQueue.length;
  }

  function CloseChatInput() {
    chatForm.hide();
  }

  function NeverLoseFocus(element) {
    element.focus();
    element.blur(function() {
      setTimeout(function() {
        element.focus();
      });
    });
  }

  function AddMessage(message, category) {
    // Create a new DIV with as class message
    var node = $("<div class='message'></div>").text(message);
    // Set the color
    AddColor(node, category);
    // Add the message to the chat
    chatArea.append(node);
    // Scroll down to make sure the latest message is visible
    chatArea.scrollTop(chatArea.height());
    //chatArea.scrollTop = chatArea.scrollHeight;
    // Whenever there are more then 15 messages delete the first one
    if (chatArea.children().length > 15) {
      chatArea.children().first().remove();
    }
    // Fade the chat away after receiving the message
    if (chatForm.is(":hidden")) {
      FadeOut();
    }
  }

  function AddColor(node, category) {
    switch (category) {
      case 'default':
        node.css("color", "#FFFFFF");
        break;
      case 'error':
        node.css("color", "#FF0000");
        break;
    }
  }

  function FadeOut() {
    chatBackground.fadeOut(config.fadeOutDuration);
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

  function AddToHistoryQueue(message) {
    if (message != "" && message != historyQueue[historyQueue.length-1]) {
      historyQueue.push(message);
      if (historyQueue.length > config.historyQueueMax) {
        historyQueue.shift();
      }
    }
  }

  function InputHistory() {
    if (historyQueue.length > 0) {
      if (historyPosition < 0) {
        historyPosition = 0;
      }
      else if (historyPosition == historyQueue.length) {
        historyPosition = historyQueue.length-1;

      }
      input.val(historyQueue[historyPosition]);
    }
  }

  input.on('keydown', function(event) {
    switch (event.key) {
      case "ArrowUp":
        // Up pressed
        historyPosition--;
        InputHistory();
        break;
      case "ArrowDown":
        historyPosition++;
        InputHistory();
        break;
    }
  });

  document.onkeypress = function (data) {
    // If the enter key is pressed
    if (data.which == 13) {
      // Remove any whitespaces from the beginning or end of the input
      var inputValue = input.val().trim();
      // Removes any extra spaces between words
      inputValue = inputValue.replace(/\s{2,}/g, ' ')
      // Clear the input.value
      input.val("");
      // Close the chat input
      CloseChatInput();
      // Fade out
      FadeOut();
      // Close the NUI and send the input to lua
      CloseNUI(inputValue);
      DisableItem();
      // Add message to history
      AddToHistoryQueue(inputValue);
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
        if (chatForm.is(":hidden")) { FadeOut(); }
        AddMessage(event.data.message, event.data.category);
        break;
      case 'fadeOut':
        if (chatForm.is(":hidden")) {
          OpenChat();
          FadeOut();
        }
        break;
      case 'command':
        AddCommand(event.data);
        break;
    }
  });

  function AddCommand(data) {
    console.log("Adding command: " + data.value);
    // Delete the command if it already exists
    for (var i = 0; i < commands.length; i++) {
      if (commands[i].value == data.value) {
        commands.splice(i, 1)
        break;
      }
    }
    // Push the command
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

    input.autocomplete({
      minLength: 1,
      source: commands,
      focus: function( event, ui ) {
        input.val( ui.item.value );
        return false;
      },
      select: function( event, ui ) {
        input.val( ui.item.value );
        $( "#command-id" ).val( ui.item.value );
        DisplayItem(ui.item);
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      var inputVal = input.val();
      if (inputVal.charAt(inputVal.length-1) != " " && displayCommand == false) {
        return $( "<li>" )
          .append( "<div>" + item.desc + "<br>" + item.label + "</div>" )
          .appendTo(ul);
      }
    };
  } );

  var item = null;
  //input.addEventListener('input', InputChange);
  input.on('input', function() {
    InputChange();
  });

  function InputChange() {
    // Get the current input value
    var inputValue = input.val();
    // Removes any extra spaces between words
    inputValue = inputValue.replace(/\s{2,}/g, ' ')
    // Create a array of the input value
    var inputValues = inputValue.split(" ");
    // If no autocomplete items were selected find one
    if (item == null && inputValues.length > 1 && inputValues[0].charAt(0) == '/') {
      item = commands.find(function(element) {
        return element.value == inputValues[0];
      });
      // If the found command does not equals with the user typed command return and set item to null
      if (item.value != inputValues[0].trim()) {
        item = null;
        return;
      }

      input.autocomplete( "close" );
      DisplayItem(item);
      return;
    }

    if (displayCommand === true) {
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
        DisableItem();
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

  function DisableItem() {
    // Disable the information about the command
    displayCommand = false;
    item = null;
    $("#commandArgs").hide();
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

});
