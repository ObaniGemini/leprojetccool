class Tools {
	constructor() {		
		this.toolsBox = document.createElement("div");
		this.toolsBox.id = "toolsBox";

		this.navBar = document.createElement("navbar");
		this.navBar.id = "navBar";

		this.canvas = null;

		this.toolsBox.appendChild( this.navBar );
		document.body.appendChild( this.toolsBox );
		this.toolsBox.style.height = this.navBar.offsetHeight + 'px';


		this.mouseDown = false;
		this.mouseOffsetX = 0;
		this.mouseOffsetY = 0;
		this.offsetLimitsX = 0;
		this.offsetLimitsY = 0;


		this.buttonWidth = 50;
		this.buttons = [];
		this.focused = "";


		//Tools
		this.addButton( "selector" );
		this.addButton( "pencil" );
		this.addButton( "eraser" );
		this.addButton( "picker" );
		this.addButton( "bucketfill" );
		this.buttons.forEach( element => this.toolsBox.appendChild( element ) );



		//Color pickers, background and foreground
		this.foregroungColor = new ColorPicker( 'rgb( 0, 0, 0 )', this.buttonWidth, parseInt( this.toolsBox.style.height ) + this.buttonWidth/2, this.buttonWidth );
		this.backgroundColor = new ColorPicker( 'rgb( 255, 255, 255 )', this.buttonWidth*2, parseInt( this.toolsBox.style.height ) + this.buttonWidth/2, this.buttonWidth );

		this.connectColorPicker( [ this.foregroungColor, this.backgroundColor ] );


		this.toolsBox.style.height = ( parseInt( this.toolsBox.style.height ) + this.buttonWidth*4 ) + 'px';

		this.toolsBox.appendChild( this.foregroungColor.button );
		this.toolsBox.appendChild( this.backgroundColor.button );


		//Pencil size input
		this.pencilSize = document.createElement("input")
		this.pencilSize.type = "number";
		this.pencilSize.value = "5";
		this.pencilSize.style.top = ( parseInt( this.toolsBox.style.height ) - this.buttonWidth*2 ) + 'px';
		this.toolsBox.appendChild( this.pencilSize );


		//Save button
		let save = document.createElement("button");
		save.innerText = "Save to desktop";
		save.type = "button";
		save.style.top = ( parseInt( this.toolsBox.style.height ) - this.buttonWidth ) + 'px';
		this.toolsBox.appendChild( save );
		save.style.left = ( this.toolsBox.offsetWidth - save.offsetWidth )/2 + 'px';


		this.updateOffsetLimits();
		this.focus( "pencil" );

		//Toolbox handlers
		window.addEventListener(		"resize",		() 		=> { this.updateOffsetLimits() } );
		document.body.addEventListener( "mousemove",	(event) => { this.move( event ) } );
		this.navBar.addEventListener(	"mousedown",	(event) => { this.setMoveOffset( event ) } );
		document.body.addEventListener( "mouseup",		() 		=> { this.mouseDown = false } );
		document.body.addEventListener( "mouseleave",	() 		=> { this.mouseDown = false } );
		save.addEventListener(			"mousedown",	() 		=> { this.saveImage() } );
	}



	linkCanvas( canvas ) {
		this.canvas = canvas;
	}



	saveImage() {
		if( this.canvas != null ) {
			this.canvas.saveImage();
		} else {
			console.log("The canvas doesn't exist !");
		}
	}




	connectColorPicker( pickers ) {
		pickers.forEach( ( picker ) => {
			picker.button.addEventListener( "mousedown", ( event ) => {	//Open window, or close it if it's not opened
				if( picker.picker == null ) {
					pickers.forEach( ( picker ) => picker.close() );
					picker.open( event );
				} else {
					pickers.forEach( ( picker ) => picker.close() );
				}
			} );
			window.addEventListener( "keydown", ( event ) => {
				if( event.key == "Escape" ) {
					picker.close();
				}
			} );
		} );
	}




	focus( name ) {
		console.log("Selecting " + name + " tool");
		this.focused = name;
		this.buttons.forEach( ( btn ) => {
			if( btn.id == name ) {
				btn.className = "button focused";
			} else {
				btn.className = "button";
			}
		} );
	}




	addButton( name ) {
		let pos = this.buttons.length;
		let button = document.createElement("div");
		let img = document.createElement("img");

		button.className = "button";
		button.id = name;

		button.style.width = this.buttonWidth + 'px';
		button.style.height = this.buttonWidth + 'px';

		button.style.left = ( this.toolsBox.offsetWidth/8 + this.toolsBox.offsetWidth/2 * ( parseInt(pos) % 2 ) ) + 'px';
		button.style.top = ( this.navBar.offsetHeight + this.buttonWidth/2 + this.buttonWidth*parseInt( parseInt(pos)/2 )*2 ) + 'px';

		button.addEventListener( "mousedown", () => { this.focus( name ) } );


		img.src = 'img/' + name + '.png';
		img.style.width = this.buttonWidth + 'px';
		img.style.height = this.buttonWidth + 'px';
		button.appendChild( img );

		console.log( "Added a button " + name + " at " + button.style.left + " " + button.style.top );

		this.toolsBox.style.height = this.navBar.offsetHeight + this.buttonWidth*( parseInt( parseInt(pos)/2 ) + 1 )*2 + 'px'; //Resize window for buttons
		this.buttons.push( button ); //Add button to the array
	}




	//Update limits for moving the toolsbox, modify pos for it doesn't go out when we resize manually
	updateOffsetLimits() {
		this.offsetLimitsX = Math.max( window.innerWidth - this.toolsBox.offsetWidth, 0 );
		this.offsetLimitsY = Math.max( window.innerHeight - this.toolsBox.offsetHeight, 0 );

		if( parseInt( this.toolsBox.style.left ) > this.offsetLimitsX ) {
			this.toolsBox.style.left = this.offsetLimitsX + 'px';
		}

		if( parseInt( this.toolsBox.style.top ) > this.offsetLimitsY ) {
			this.toolsBox.style.top = this.offsetLimitsY + 'px';
		}
	}



	//Sets mouse move offset to move the window from the point the navbar is clicked from
	setMoveOffset( event ) {
		this.mouseOffsetX = this.toolsBox.offsetLeft - event.clientX;
		this.mouseOffsetY = this.toolsBox.offsetTop - event.clientY;

		this.mouseDown = true;
	}



	//Moves the window if mouse is down, depending on window limits
	move( event ) {
		if( this.mouseDown ) {
			this.toolsBox.style.left = Math.min( Math.max( event.clientX + this.mouseOffsetX, 0 ), this.offsetLimitsX ) + 'px';
			this.toolsBox.style.top = Math.min( Math.max( event.clientY + this.mouseOffsetY, 0 ), this.offsetLimitsY ) + 'px';
		}
	}
}