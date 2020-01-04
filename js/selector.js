class Selector {
	constructor( canvas ) {
		this.enabled = false;
		this.X1 = 0;
		this.X2 = 0;
		this.Y1 = 0;
		this.Y2 = 0;

		this.window = document.createElement( "div" );
		this.window.id = "selectedArea";
		this.window.setAttribute( "tabindex", "-1" );


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
		this.enabled = false;
		if( document.getElementById( "selectedArea" ) != null ) {
			document.body.removeChild( this.window );
		}
	}
}