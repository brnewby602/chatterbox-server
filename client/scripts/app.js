var app = {
  // http://127.0.0.1:3000/
  // may need port to be separate
  url: 'http://127.0.0.1:3000/',
  room: 'lobby',
  messages: [],
  friends: []
};

// INITIALIZE THE APP
app.init = function() {

  // we're now using local storage
  localStorage.getItem('friends')
    ? app.friends = JSON.parse(localStorage.getItem('friends'))
    : localStorage.setItem('friends', JSON.stringify([]));

  // event handlers
  $('#chats').on('click', '.username', function() { app.addFriend(this); });
  $('#rooms').on('click', 'li', app.viewRoom);
  $('#message').off('submit').on('submit', app.handleSubmit); 

  // initially populate with messages and update every 3 seconds
  app.fetch(app.url + '/messages');

  // NOTE: We gave up on using setInterval for now (to refresh regularly)
};


/* EVENT HANDLERS */
app.handleSubmit = function(e) {
  e.preventDefault();

  var newMessage = $(this).children('#lameID').val();
  var user = window.location.search.split('=')[1];
  var message = {
    username: user,
    text: newMessage,
    roomname: app.room
  };

  app.send(message);

};
// view selected room
// messages submitted are added to the room the user is in
app.viewRoom = function() {
  app.room = $(this).text();
  app.refresh();
};



/* AJAX REQUESTS */
// ajax GET
app.fetch = function(url) {
  $('.spinner').toggle();
  $.ajax({
    url: url,
    type: 'GET',
    success: function (data) {
      // set lastMessageId to the ObjectID of the last message in data
      var mostRecent = data.results[data.results.length - 1];
      // if mostRecent is not equal to what it was before, we have new data!
      if (mostRecent.objectId !== app.lastMessageId || app.lastMessageId === undefined ) {
        console.log('found new data, its', mostRecent);
        app.clearMessages(); 
        $('.spinner').toggle();
        app.populateMessages(data); 
        app.displayRooms(data); 
        
        app.lastMessageId = mostRecent.ObjectId;
      }
      // call these three functions
    },
    error: function (data) {
      console.error('chatterbox: failed to fetch content', data.error());
    }
  });
};

// ajax POST
app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: this.url + '/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      app.refresh();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};


/* POPULATE MESSAGES AND ROOMS */
app.displayRooms = function(data) {
  var roomNames = {};
  data.results.forEach(function(result) {
    roomNames[result.roomname] = 1;
  });
  for (var room in roomNames) {
    // could be vulnerable if 'room' is BAD
    if (room !== '') {
      $('#rooms').append('<li>' + room + '</li>');
    }
  }
};


// called by fetch's success
// filters all messages to ones matching current room and displays them
app.populateMessages = function(data) {
  var fetchedData = data.results;
  for (var i = 0; i < fetchedData.length; i++) {
    if (fetchedData[i].roomname === app.room) {
      app.displayMessage(fetchedData[i]);
    }
  }
};

// called by populateMessages (helper function)
// builds and displays one message
app.displayMessage = function(message) {
  var $message = $('<div class="chat"/>');
  var $username = $('<div class="username"/>')
    .text(message.username);
  var $messageText = $('<div class="text"/>')
    .text(message.text);

  // if message.username is in friends 
  if (app.friends.indexOf(message.username) !== -1) {
    // add class friend to $username
    $username.addClass('friend');
  }

  $message.append($username).append($messageText);

  $('#chats').append($message);
};


/* ADD MESSAGES */
app.addFriend = function(friend) {
  // add this friend to app.friends
  app.friends.push(friend.textContent);
  localStorage.setItem('friends', JSON.stringify(app.friends));

  var friend = friend.textContent;

  var allUsers = $('.username');
  // iterate through current messages
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].textContent === friend) {
      $(allUsers[i]).addClass('friend');
    }
  }
};


/* CLEAR THE HTML */
// (QUESTIONABLE)
app.clearMessages = function() {
  $('#chats').html('');
  $('#rooms').html('');
};

app.refresh = function() {
  app.clearMessages();
  app.fetch(app.url + '/messages');
};