
// Constants
const fs = require('fs');
const path = require('path');
const client = require("./js/client.js");

// Check if credentials exist in storage
client.getCredentials((credentials) => {
  if (credentials) {

    // Hide window early
    $("#login-modal").fadeOut(150);

    // Initialize client
    client.init(credentials);
  }
});

// Submit login
$("#login-form").submit(e => {
  e.preventDefault();

  // Loading
  $("#login-form input[name='username']").prop("disabled", true);
  $("#login-form input[name='password']").prop("disabled", true);
  $("#login-form button").prop("disabled", true);

  let credentials = {
    username: $("input[name='username']").val(),
    password: $("input[name='password']").val()
  }

  console.log("Saving credentials to storage...");
  client.updateCredentials(credentials, () => {
    client.init(credentials);
  });
});

// Click on tab
$(document).on("click", "#tab-slider .tab span", e => {
  client.changeTab($(e.target).parent().data("channel"));
});

// Click on send message
$(document).on("click", "#send-button", () => {
  var message = $("#text-input").val();
  if (message === "") return;

  client.sendMessage(client.tabs[client.activeTab].name, message);

  $("#text-input").val("");
});

// If enter was pressed
$(document).on("keyup", "#text-input", e => {
  if (e.keyCode === 13) {
    var message = $("#text-input").val();
    if (message === "") return;

    client.sendMessage(client.tabs[client.activeTab].name, message);

    $("#text-input").val("");
  }
});

// Open join channel modal
$(document).on("click", "#open-channel-dialog", () => {

  // Reset values
  $("#select-channel-modal .channel-row").remove();
  $("#channels-filter").val("");
  
  // Open dialog
  $("#select-channel-modal").fadeIn(150);

  client.channels.forEach((channelInfo) => {

    // Collect all channel names we have open
    let tabsList = client.tabs.map(e => e.name);

    // Skip any channels we already have opened
    if (channelInfo.name in tabsList) return;

    // Append the html
    $("#channels-list").append(
      `<div data-channel="${channelInfo.name}" class="channel-row join-channel">
         <h1>${channelInfo.name}</h1>
         <p>${channelInfo.topic}<span class="active-users">${channelInfo.users} users</span></p>
       </div>`);
  }, this);
});

$(document).on("click", ".join-channel", e => {
  client.joinChannel($(e.target).parent(".join-channel").data("channel"));
  $("#select-channel-modal").fadeOut(150);
});

$(document).on("click", "#exit-select-channel-modal", e => {
  $("#select-channel-modal").fadeOut(150);
});

$(document).on("click", "#swipe-left", () => {
  $("#tab-slider").animate({scrollLeft: $("#tab-slider").scrollLeft() - 100}, 200);
});

$(document).on("click", "#swipe-right", () => {
  $("#tab-slider").animate({scrollLeft: $("#tab-slider").scrollLeft() + 100}, 200);
});