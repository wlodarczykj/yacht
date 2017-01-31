import "phoenix_html"
import {Socket} from "phoenix"

// Initialize Socket.
let socket = new Socket("/socket", {params: {token: window.userToken}});

//Functions
//=============================================
function clearCanvas() {
  collabCanvas.width = collabCanvas.width;
  ctx.lineWidth = 2;
}

function reloadUserTable() {
  var scope = $('#mainBody').scope();
  $.getJSON("/users", function(data){
    scope.users = data.users;
    scope.$apply();
  });
}

//MAINLINE code
//==============================================

//Connect socket.
socket.connect();
window.channel = socket.channel("room:lobby", {});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) });

//Socket events
//==========================
channel.on("drawline", payload => {
  ctx.beginPath();
  ctx.strokeStyle = payload.color;
  ctx.moveTo(payload.from.x, payload.from.y);
  ctx.lineTo(payload.to.x, payload.to.y);
  ctx.stroke();
  ctx.closePath();
});

channel.on("clear", payload => {
  console.log("Clearing canvas.");
  clearCanvas();
});

channel.on("mousemove", payload => {
  var img = document.getElementById("cursor");
  img.display="inline";
  mouseCanvas.width = mouseCanvas.width;
  if(payload.name != currUser)
  {
    cursorStates[payload.name] = {"x" : payload.position.x, "y" :  payload.position.y}
  }

  //Iterate through every cursor position and draw them all back. This may be slow...
  var cursorKeys = Object.keys(cursorStates);
  cursorKeys.forEach(function(currKey){
    mouseCtx.drawImage(img, cursorStates[currKey].x, cursorStates[currKey].y);
  });
});

channel.on("userJoined", payload =>{
  console.log("Reloading User Table.");
  //Not sure why it only works if I give it a timeout, prolly an async somewhere.
  setTimeout(reloadUserTable, 100);
});
