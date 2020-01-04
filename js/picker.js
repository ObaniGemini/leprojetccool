class ColorPicker {
	constructor( initRGB, posX, posY, size ) {
		this.rgb = initRGB;
		this.button = document.createElement( "div" );

		this.button.style.backgroundColor = this.rgb;
		this.button.style.position = "absolute";

		this.button.style.width = size + 'px';
		this.button.style.height = size + 'px';

		this.button.style.left = posX + 'px';
		this.button.style.top = posY + 'px';

		this.picker = null;
	}


	update() {
		this.button.style.backgroundColor = this.rgb;
	}


	open( event ) {
		this.picker = new PickerWindow( event.x, event.y, this.rgb );
		this.picker.window.addEventListener( "mousemove", () => {
			this.rgb = 'rgb( ' + this.picker.value[0] + ', ' + this.picker.value[1] + ", " + this.picker.value[2] + " )";
			this.update();
		} );
		document.body.appendChild( this.picker.window );
	}


	close() {
		if( this.picker != null ) {
			this.rgb = 'rgb( ' + this.picker.value[0] + ', ' + this.picker.value[1] + ", " + this.picker.value[2] + " )";
			this.update();
			document.body.removeChild( this.picker.window );
			this.picker = null;
		}
	}
}





class PickerWindow {
	constructor( posY, posX, rgb ) {
		this.sliderHeight = 25;
		this.cursorColor = 'rgb( 220, 220, 220 )';

		this.window = document.createElement( "div" );
		this.window.className = "colorpicker";
		this.window.style.left = posX + 'px';
		this.window.style.top = posY + 'px';

		this.posX = posX;
		this.value = [ 0, 0, 0 ];
		rgb.split(',').forEach( ( element, idx ) => { this.value[ idx ] = parseInt( element ); } );


		this.mousedown = false;
		this.focused = 0;


		this.colors = [ document.createElement( "canvas" ), document.createElement( "canvas" ), document.createElement( "canvas" ) ];
		this.colors.forEach( ( canvas, idx ) => {
			canvas.setAttribute( "width", "256px" );
			canvas.setAttribute( "height", this.sliderHeight + 'px' );
			let context = canvas.getContext( "2d" );


			let rgb1 = 'rgb( ';
			let rgb2 = '';

			for( let i = 0; i < idx; i++ ) {
				rgb1 += '0, ';
			} for( let i = idx; i < 3; i++ ) {
				rgb2 += ( i == 2 ? ' )' : ', 0' );
			}

			for( let i = 0; i < 256; i++ ) {
				if( i >= this.value[ idx ] - 2 && i <= this.value[ idx ] + 2 ) {
					context.fillStyle = this.cursorColor;
					context.fillRect( Math.max( 0, this.value[ idx ] - 2 ), 0, 4, this.sliderHeight );
					i += 4;
				} else {
					context.fillStyle = rgb1 + i + rgb2;
					context.fillRect( i, 0, 1, this.sliderHeight );
				}
			}

			canvas.addEventListener( "mousedown", ( event ) => {
				this.mousedown = true;
				this.focused = idx;
				this.updateGradient( event );
			} );
			document.body.addEventListener( "mousemove", ( event ) => {
				this.updateGradient( event );
			} );
			window.addEventListener( "mouseup", () => {
				this.mousedown = false;
			} );
			document.body.addEventListener( "mouseleave", () => {
				this.mousedown = false;
			} );


			this.window.appendChild( canvas );
		} );
	}




	updateGradient( event ) {
		if( this.mousedown ) {
			let idx = this.focused;
			let rgb1 = 'rgb( ';
			let rgb2 = '';
			let context = this.colors[ idx ].getContext( "2d" );



			for( let i = 0; i < idx; i++ ) {
				rgb1 += '0, ';
			} for( let i = idx; i < 3; i++ ) {
				rgb2 += ( i == 2 ? ' )' : ', 0' );
			}

			let max = Math.min( this.value[ idx ] + 2, 255 );
			for( let i = this.value[ idx ] - 2; i < max; i++ ) {
				context.fillStyle = rgb1 + this.value[ idx ] + rgb2; //Removing the cursor
				context.fillRect( i, 0, 1, this.sliderHeight );
			}

			this.value[ idx ] = Math.max( Math.min( event.x - this.posX, 255 ), 0 );

			context.fillStyle = this.cursorColor; //Setting the cursor
			context.fillRect( Math.max( 0, this.value[ idx ] - 2 ) , 0, 4, this.sliderHeight );
		}
	}
}