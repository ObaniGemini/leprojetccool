class Canvas {
	constructor( tools ) {
		this.tools = tools;
		this.selector = new Selector();
		this.mouseDown = false;
		this.lastMousePos = [ -1, -1 ];

		this.canvas = document.createElement( "canvas" );
		this.canvas.className = "drawing_canvas";

		this.ctx = this.canvas.getContext( "2d" );
		document.body.appendChild( this.canvas );
		this.canvas.setAttribute( "width", screen.width );		//We don't resize canvas because this would clear the screen space
		this.canvas.setAttribute( "height", screen.height );

		this.ctx.fillStyle = 'rgb( 255, 255, 255 )';
		this.ctx.fillRect( 0, 0, screen.width, screen.height ); //Init this so that picker works

		this.canvas.addEventListener( "mousedown", ( event ) => { this.startDrawing( event ) } );
		window.addEventListener( 	  "mouseup",   ( event ) => { this.stopDrawing( event ) } );
		this.canvas.addEventListener( "mousemove", ( event ) => { this.draw( event ) } );
	}




	startDrawing( event ) {
		this.ctx.lineWidth = parseInt( this.tools.pencilSize.value );

		if( this.tools.focused == "selector") {
			this.selector.remove();
		} else if( this.tools.focused == "eraser" ) {
			this.ctx.fillStyle = this.tools.backgroundColor.rgb;
			this.ctx.strokeStyle = this.tools.backgroundColor.rgb;
		} else {
			this.ctx.fillStyle = this.tools.foregroungColor.rgb;
			this.ctx.strokeStyle = this.tools.foregroungColor.rgb;
		}

		this.lastMousePos = [ event.layerX, event.layerY ];
		this.mouseDown = true;
		this.draw( event );
	}


	stopDrawing( event ) {
		this.mouseDown = false;
		this.lastMousePos = [ -1, -1 ];
	}



	pickColor( x, y ) {
		let pixel = this.ctx.getImageData( x, y, 1, 1 );
		let c = pixel.data;
		return c;
	}



	draw( event ) {
		if( !this.mouseDown )
			return;

		let X = event.clientX;
		let Y = event.clientY;


		if( this.tools.focused == "selector" ) {
			if( this.selector.enabled ) {
				this.selector.update( X, Y );
			} else if( this.lastMousePos[ 0 ] != X || this.lastMousePos[ 1 ] != Y ) {
				this.selector.add( X, Y );
			}
		}


		else if( this.selector.enabled &&
			   ( X < this.selector.X1 || X > this.selector.X2 || Y < this.selector.Y1 || Y > this.selector.Y2 ) )
		{
			return;
		}


		else if( this.tools.focused == "pencil" || this.tools.focused == "eraser" ) {
			if( this.lastMousePos[ 0 ] != -1 ) {
				this.ctx.beginPath();
				this.ctx.moveTo( this.lastMousePos[ 0 ], this.lastMousePos[ 1 ] );
				this.ctx.lineTo( X, Y );
				this.ctx.stroke();
			}

		    this.ctx.beginPath();
		    this.ctx.arc( X, Y, parseInt( this.tools.pencilSize.value )/2, 0, 2 * Math.PI );
		    this.ctx.fill();

		    this.lastMousePos = [ X, Y ];
		}


		else if( this.tools.focused == "picker" ) {
			let fillColor = [ parseInt( (this.ctx.fillStyle.split(','))[ 0 ] ), parseInt( (this.ctx.fillStyle.split(','))[ 1 ] ), parseInt( (this.ctx.fillStyle.split(','))[ 2 ] ) ];
			console.log(fillColor);
			console.log(this.ctx.fillStyle.split(','))
			let c = this.pickColor( X, Y );
			console.log( 'Picked color rgb( ' + c[0] + ', ' + c[1] + ', ' + c[2] + ' )' );

			this.tools.foregroungColor.rgb = 'rgb( ' + c[0] + ', ' + c[1] + ', ' + c[2] + ' )';
			this.tools.foregroungColor.update();
		}


		else if( this.tools.focused == "bucketfill" ) {

			let fillColor = [ parseInt( this.ctx.fillStyle.split(',')[ 0 ] ), parseInt( this.ctx.fillStyle.split(',')[ 1 ] ), parseInt( this.ctx.fillStyle.split(',')[ 2 ] ) ];
			console.log( fillColor );
			let toFillColor = this.pickColor( X, Y );
			let W = this.canvas.width;
			let H = this.canvas.height;

			let tmp_img = this.ctx.getImageData( 0, 0, W, H );

			let fullImage = tmp_img.data;
			let visited = [ X + Y*W ];
			let toCheck = [ (X-1) + W*Y, X + W*(Y-1), (X+1) + W*Y, X + W*(Y+1) ];

			while( toCheck.length > 0 ) {
				let last = -1;
				toCheck.forEach( ( element, idx ) => {
					last = idx;
					if( visited.includes( element ) ) {
						return;
					}

					let pos = element*4;
					if( fullImage[ pos ] == toFillColor[ 0 ] && fullImage[ pos + 1 ] == toFillColor[ 1 ] && fullImage[ pos + 2 ] == toFillColor[ 2 ] ) {
						visited.push( element );

						toCheck.push( element - 1 ); // X - 1
						toCheck.push( element - W ); // Y - 1
						toCheck.push( element + 1 ); // X + 1
						toCheck.push( element + W ); // Y + 1
					}
				} );

				for( let i = last; i >= 0; i-- ) {
					toCheck.shift();
				}
			}

			visited.forEach( ( element ) => {
				let pos = element*4;
				fullImage[ pos ] 	 = fillColor[ 0 ];
				fullImage[ pos + 1 ] = fillColor[ 1 ];
				fullImage[ pos + 2 ] = fillColor[ 2 ];
			} );

			this.ctx.putImageData( fullImage, 0, 0 );
		}
	}
}