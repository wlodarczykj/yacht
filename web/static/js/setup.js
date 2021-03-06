/*====================================================================
 *
 * This file is used to setup all the necessary tools the other scripts need.
 *
 =====================================================================*/

// Setup Angular
window.yachtApp = angular.module('yachtApp', []);

//Setup Canvas "stuff"
//========================
window.currUser = "";
window.cursorStates = {};
window.drawing = false;
window.mousePos = { x:0, y:0 };
window.lastPos = mousePos;

// Mouse Layer
window.mouseCanvas = document.getElementById("mouse-canvas");
window.mouseCtx = mouseCanvas.getContext("2d");

// Drawing Layer
window.collabCanvas = document.getElementById("collab-canvas");
window.ctx = collabCanvas.getContext("2d");
window.drawColor = "#000000";
ctx.strokeStyle = drawColor;
ctx.lineWidth = 2;
