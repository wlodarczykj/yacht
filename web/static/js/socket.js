import "phoenix_html"
import {Socket} from "phoenix"

function clearCanvas() {
  collabCanvas.width = collabCanvas.width;
}

// Initialize Socket.
let socket = new Socket("/socket", {params: {token: window.userToken}});

//Connect socket.
socket.connect();
window.channel = socket.channel("room:lobby", {});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) });

//Socket events
//==========================
channel.on("drawline", payload => {
    ctx.moveTo(payload.from.x, payload.from.y);
    ctx.lineTo(payload.to.x, payload.to.y);
    ctx.stroke();
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
