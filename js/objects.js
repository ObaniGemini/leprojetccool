class Canvas {
	constructor() {
		this.canvas = document.createElement( "canvas" );
		this.canvas.className = "drawing_canvas";
		this.resize();

		this.ctx = this.canvas.getContext( "2d" );
		document.body.appendChild( this.canvas );
		this.resize();
	}

	//resize canvas
	resize() {
		this.canvas.setAttribute("width", window.innerWidth);
		this.canvas.setAttribute("height", window.innerHeight);
	}
}


class ColorPicker {
	constructor( posX, posY ) {
		this.window = document.createElement( "div" );
		this.window.className = "colorpicker";
		this.window.style.left = posX + 'px';
		this.window.style.top = posY + 'px';

		this.sliders = [
			new ColorSlider( 0, posX ),
			new ColorSlider( 1, posX ),
			new ColorSlider( 2, posX )
		];

		this.sliders.forEach( element => this.window.appendChild( element.color ) );
	}
}


class ColorSlider {
	constructor( idx, posX ) {
		let sliderHeight = 25;
		let rgb1 = 'rgb( ';
		let rgb2 = '';

		this.color = document.createElement( "canvas" );
		this.cursor = document.createElement( "div" );


		this.color.setAttribute( "width", "256px" );
		this.color.setAttribute( "height", sliderHeight + 'px' );
		this.cursor.setAttribute( "height", sliderHeight + 'px ');
		this.color.appendChild( this.cursor );


		this.context = this.color.getContext( "2d" );
		this.value = 255;
		this.posX = posX;


		for( let i = 0; i < idx; i++ ) {
			rgb1 += '0, ';
		} for( let i = idx; i < 3; i++ ) {
			rgb2 += ( i == 2 ? ' )' : ', 0' );
		}

		for( let i = 0; i < 256; i++ ) {
			this.context.fillStyle = rgb1 + i + rgb2;
			this.context.fillRect( i, 0, 1, sliderHeight );
		}

		this.color.addEventListener( "mousedown", this.updateGradient );
	}


	updateGradient( event ) {
		this.value = event.x - this.posX;
		console.log( this.posX );
	}
}




class Tools {
	constructor() {
		this.toolsBox = document.createElement("div");
		this.toolsBox.id = "toolsBox";

		this.navBar = document.createElement("navbar");
		this.navBar.id = "navBar";


		this.toolsBox.appendChild( this.navBar );
		document.body.appendChild( this.toolsBox );
		this.toolsBox.style.height = this.navBar.offsetHeight + 'px';


		this.mouseDown = false;
		this.mouseOffset = [ 0, 0 ];
		this.offsetLimits = [ 0, 0 ];


		this.buttonWidth = 50;
		this.buttons = [];
		this.focused = -1;


		this.addButton( "selector" );
		this.addButton( "pencil" );
		this.addButton( "picker" );
		this.addButton( "bucketfill" );
		this.buttons.forEach( element => this.toolsBox.appendChild( element ) );

		this.updateOffsetLimits();

		this.focus( "pencil" );
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

		button.className = "button";
		button.id = name;

		button.style.width = this.buttonWidth + 'px';
		button.style.height = this.buttonWidth + 'px';

		button.style.left = ( this.toolsBox.offsetWidth/8 + this.toolsBox.offsetWidth/2 * ( parseInt(pos) % 2 ) ) + 'px';
		button.style.top = ( this.navBar.offsetHeight + this.buttonWidth/2 + this.buttonWidth*parseInt( parseInt(pos)/2 )*2 ) + 'px';

		button.addEventListener( "mousedown", () => { this.focus( name ) } );

		console.log( "Added a button " + name + " at " + button.style.left + " " + button.style.top );

		this.toolsBox.style.height = this.navBar.offsetHeight + this.buttonWidth*( parseInt( parseInt(pos)/2 ) + 1 )*2 + 'px'; //Resize window for buttons
		this.buttons.push( button ); //Add button to the array
	}



	//Update limits for moving the toolsbox, modify pos for it doesn't go out when we resize manually
	updateOffsetLimits() {
		this.offsetLimits = [
			Math.max( window.innerWidth - this.toolsBox.offsetWidth, 0 ),
			Math.max( window.innerHeight - this.toolsBox.offsetHeight, 0 )
		];

		if( parseInt( this.toolsBox.style.left ) > this.offsetLimits[ 0 ] ) {
			this.toolsBox.style.left = this.offsetLimits[ 0 ] + 'px';
		}

		if( parseInt( this.toolsBox.style.top ) > this.offsetLimits[ 1 ] ) {
			this.toolsBox.style.top = this.offsetLimits[ 1 ] + 'px';
		}
	}



	//Sets mouse move offset to move the window from the point the navbar is clicked from
	setMoveOffset( event ) {
		this.mouseOffset = [
			this.toolsBox.offsetLeft - event.clientX,
			this.toolsBox.offsetTop - event.clientY
		];
		this.mouseDown = true;
	}



	//Moves the window if mouse is down, depending on window limits
	move( event ) {
		if( this.mouseDown ) {
			this.toolsBox.style.left = Math.min( Math.max( event.clientX + this.mouseOffset[ 0 ], 0 ), this.offsetLimits[ 0 ] ) + 'px';
			this.toolsBox.style.top = Math.min( Math.max( event.clientY + this.mouseOffset[ 1 ], 0 ), this.offsetLimits[ 1 ] ) + 'px';
		}
	}
}