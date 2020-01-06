var tools;
var canvas;


const main = () => {
	tools = new Tools();
	canvas = new Canvas( tools );
}


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

const handleMod = ( event ) => {
	if( event.ctrlKey && tools.focused == "selector" ) {
		if( event.key == "c" ) {
			canvas.selector.copySelection();
		} else if( event.key == "v" ) {
			canvas.selector.pasteSelection();
		}
	}

	if( event.ctrlKey && tools.focused == "pencil" ) {
		tools.focus( "picker" );
	} else if( tools.focused == "picker" ) {
		tools.focus( "pencil" );
	}
}


window.addEventListener("keydown", handleInput);
window.addEventListener("keyup", handleMod);
window.addEventListener("load", main);