var tools;
var canvas;


//The beginning
const main = () => {
	tools = new Tools();
	canvas = new Canvas( tools );

	tools.linkCanvas( canvas );
}



//handle input shortcuts
const handleInput = ( event ) => {
	let key = event.key;

	if( key == "s" ) {
		tools.focus( "selector" );
	} else if( key == "p" ) {
		tools.focus( "pencil" );
	} else if( key == "e" ) {
		tools.focus( "eraser" );
	} else if( key == "l" ) {
		tools.focus( "picker" );
	} else if( key == "b" ) {
		tools.focus( "bucketfill" );
	}

	handleMod( event );
}



//handle bindings with Ctrl
const handleMod = ( event ) => {
	if( event.ctrlKey && tools.focused == "selector" && event.key == "c" ) {
		canvas.selector.copySelection();
	} else if( event.ctrlKey && event.key == "v" ) {
		tools.focus("selector");
		canvas.selector.pasteSelection();
	}

	else if( event.ctrlKey && tools.focused == "pencil" ) {
		tools.focus( "picker" );
	} else if( tools.focused == "picker" ) {
		tools.focus( "pencil" );
	}
}




window.addEventListener("keydown", handleInput);
window.addEventListener("keyup", handleMod);
window.addEventListener("load", main);