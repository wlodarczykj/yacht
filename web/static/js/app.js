import "phoenix_html"
import {Socket} from "phoenix"

var otherUsers = [];
var currUser = "";

$(document).ready(function(){
   if(!currUser)
   {
     currUser = prompt("Please enter your username", "Anonymous");
     console.log(currUser);
   }
});



// Initialize Socket.
let socket = new Socket("/socket", {params: {token: window.userToken}});

//Connect socket.
socket.connect();

let channel = socket.channel("room:lobby", {});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) });

// Set up the Collaboration Layer
var collabCanvas = document.getElementById("collab-canvas");
var ctx = collabCanvas.getContext("2d");
ctx.strokeStyle = "#222222";
ctx.lineWidth = 2;

function clearCanvas() {
  collabCanvas.width = collabCanvas.width;
}

// Set up the Mouse Layer
var mouseCanvas = document.getElementById("mouse-canvas");
var mouseCtx = mouseCanvas.getContext("2d");

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
  mouseCtx.drawImage(img, payload.position.x, payload.position.y);
});

(function() {

	// Get a regular interval for drawing to the screen
	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimaitonFrame ||
					function (callback) {
					 	window.setTimeout(callback, 1000/60);
					};
	})();
	// Set up the UI
	var clearBtn = document.getElementById("clearBtn");
	clearBtn.addEventListener("click", function (e) {
    channel.push("clear", { });
		clearCanvas();
	}, false);

	// Set up mouse events for drawing
	var drawing = false;
	var mousePos = { x:0, y:0 };
	var lastPos = mousePos;
	collabCanvas.addEventListener("mousedown", function (e) {
		drawing = true;
		lastPos = getMousePos(collabCanvas, e);
	}, false);
	collabCanvas.addEventListener("mouseup", function (e) {
		drawing = false;
	}, false);
	collabCanvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(collabCanvas, e);
    channel.push("mousemove", {
      position : {
        x : mousePos.x,
        y : mousePos.y
      }
    });
	}, false);

	// Set up touch events for mobile, etc
	collabCanvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(collabCanvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	collabCanvas.addEventListener("touchend", function (e) {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	collabCanvas.addEventListener("touchmove", function (e) {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Prevent scrolling when touching the canvas
	document.body.addEventListener("touchstart", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchend", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);

	// Get the position of the mouse relative to the canvas
	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

	// Draw to the canvas
	function renderCanvas() {
		if (drawing) {
      if(lastPos.x != mousePos.x || lastPos.y != mousePos.y)
      {
        channel.push("drawline", {
          from : {
            x : lastPos.x,
            y : lastPos.y
          },
          to : {
            x : mousePos.x,
            y : mousePos.y
          }
        });
      }
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

})();
