import "./setup.js"
import "./roomcontroller.js"
import "./socket.js"

function clearCanvas() {
  collabCanvas.width = collabCanvas.width;
}

$(document).ready(function(){
   if(!currUser)
   {
     var baseName = "Anon" + Math.floor(Math.random() * 100);
     currUser = baseName;
     $("#username").val(baseName);
     channel.push("userJoined", {
       "name": currUser
     });
   }
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

  var changeUserBtn = document.getElementById("enterUser");
  changeUserBtn.addEventListener("click", function (e) {
      channel.push("userJoined", { });
  }, false);

  //Drawing events for desktop
	mouseCanvas.addEventListener("mousedown", function (e) {
		drawing = true;
		lastPos = getMousePos(collabCanvas, e);
	}, false);
	mouseCanvas.addEventListener("mouseup", function (e) {
		drawing = false;
	}, false);
	mouseCanvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(collabCanvas, e);
    channel.push("mousemove", {
      "name": currUser,
      "position" : {
        "x" : mousePos.x,
        "y" : mousePos.y
      }
    });
	}, false);

	// Drawing events for Mobile
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
