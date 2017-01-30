/*====================================================================
 *
 * This file is used to setup all the necessary tools the other scripts need.
 *
 =====================================================================*/

//Current username
window.currUser = "";
//Used to figure out how to draw the other user's mouse pointers to screen.
window.cursorStates = {};
// Drawing variables.
window.drawing = false;
window.mousePos = { x:0, y:0 };
window.lastPos = mousePos;

// Set up the Mouse Layer
window.mouseCanvas = document.getElementById("mouse-canvas");
window.mouseCtx = mouseCanvas.getContext("2d");

// Set up the Drawing Layer
window.collabCanvas = document.getElementById("collab-canvas");
window.ctx = collabCanvas.getContext("2d");
ctx.strokeStyle = "#222222";
ctx.lineWidth = 2;
