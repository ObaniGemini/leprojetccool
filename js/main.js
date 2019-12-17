var canvas;
var tools;
var openedWindows = [];



const main = () => {
	canvas = new Canvas();
	tools = new Tools();

	pushWindow( new ColorPicker( 200, 100 ) ); //just for testing

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


const handleInput = ( event ) => {
	let key = event.key;

	if( key == "s" ) {
		tools.focus( "selector" );
	} else if( key == "p" ) {
		tools.focus( "pencil" );
	} else if( key == "l" ) {
		tools.focus( "picker" );
	} else if( key == "b" ) {
		tools.focus( "bucketfill" );
	} else if( key == "Escape" ) {
		popWindow();
	}
}


const pushWindow = ( object ) => {
	openedWindows.push( object );
	document.body.appendChild( openedWindows[openedWindows.length - 1].window );
}

const popWindow = () => {
	if( openedWindows.length > 0 ) {
		document.body.removeChild( openedWindows[openedWindows.length - 1].window );
		openedWindows.pop();
	}
}


window.addEventListener("keydown", handleInput);
window.addEventListener("load", main);