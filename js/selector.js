class Selector {
	constructor( canvas ) {
		this.canvas = canvas;
		this.enabled = false;
		this.selected = false;
		this.saved = false;
		this.mouseOffset = [ -1, -1 ];

		this.X1 = 0;
		this.X2 = 0;
		this.Y1 = 0;
		this.Y2 = 0;

		this.window = document.createElement( "div" );
		this.window.id = "selectedArea";
		this.window.setAttribute( "tabindex", "-1" );

		this.selectedImg = document.createElement( "canvas" );
	}


	contains( posX, posY ) {
		return ( posX > this.X1 && posX < this.X2 && posY > this.Y1 && posY < this.Y2 );
	}


	select( posX, posY ) {
		this.selected = true;
		this.mouseOffset = [ posX - this.X1, posY - this.Y1 ];
	}


	unselect() {
		this.selected = false;
		this.mouseOffset = [ -1, -1 ];
	}


	copySelection() {
		if( this.enabled ) {
			let width = this.X2 - this.X1;
			let height = this.Y2 - this.Y1;

			this.selectedImg.setAttribute( "width", width + 'px' );
			this.selectedImg.setAttribute( "height", height + 'px' );

			let imgData = this.canvas.ctx.getImageData( this.X1, this.Y1, width, height );
			this.selectedImg.getContext("2d").putImageData( imgData, 0, 0 );
			this.saved = true;
		}
	}


	pasteSelection() {
		if( this.saved ) {
			if( !this.enabled ) {
				this.add( this.X1, this.Y1 );
			} this.update( this.X1 + parseInt( this.selectedImg.width ), this.Y1 + parseInt( this.selectedImg.height ) );

			this.window.appendChild( this.selectedImg );
		}
	}


	insertSelection() {
		if( this.enabled && this.saved && this.window.firstChild != null ) {
			let imgData = this.selectedImg.getContext("2d").getImageData( 0, 0, this.selectedImg.width, this.selectedImg.height );
			this.canvas.ctx.putImageData( imgData, this.X1, this.Y1 );
			this.window.removeChild( this.selectedImg );
		}
	}


	move( posX, posY ) {
		this.X1 = posX - this.mouseOffset[ 0 ];
		this.Y1 = posY - this.mouseOffset[ 1 ];
		this.window.style.left = this.X1 + 'px';
		this.window.style.top  = this.Y1 + 'px';
	}


	add( posX, posY ) {
		this.enabled = true;
		this.X1 = posX;
		this.X2 = posX;
		this.Y1 = posY;
		this.Y2 = posY;

		this.window.style.left = this.X1 + 'px';
		this.window.style.top = this.Y1 + 'px';
		this.window.style.width = '0px';
		this.window.style.height = '0px';

		document.body.appendChild( this.window );
	}


	update( posX, posY ) {
		if( posX < this.X1 ) {
			this.X1 = posX;
			this.window.style.left = this.X1 + 'px';
		} else {
			this.X2 = posX;
		}

		if( posY < this.Y1 ) {
			this.Y1 = posY;
			this.window.style.top = this.Y1 + 'px';
		} else {
			this.Y2 = posY;
		}


		this.window.style.width = ( this.X2 - this.X1 ) + 'px';
		this.window.style.height = ( this.Y2 - this.Y1 ) + 'px';
	}


	remove() {
		this.insertSelection();
		this.enabled = false;
		if( document.getElementById( "selectedArea" ) != null ) {
			document.body.removeChild( this.window );
		}
	}
}