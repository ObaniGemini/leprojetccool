var canvas;
var tools;



const main = () => {
	canvas = new Canvas();
	tools = new Tools();

	window.addEventListener("resize", () => {
		canvas.resize();
		tools.updateOffsetLimits();
	} );

	document.body.addEventListener( "mousemove", (event) => {
		tools.move( event );
	} );

	tools.navBar.addEventListener( "mousedown", (event) => {
		tools.setMoveOffset( event );
	} );

	document.body.addEventListener( "mouseup", () => {
		tools.mouseDown = false;
	} );
}


window.addEventListener("load", main);