class Canvas {
	constructor() {
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.resize();
	}

	//resize canvas
	resize() {
		this.canvas.style.width = window.innerWidth;	//Set canvas size
		this.canvas.style.height = window.innerHeight;
	}
}




class Tools {
	constructor() {
		this.toolsBox = document.getElementById("tools");
		this.navBar = document.getElementById("navbar");

		this.mouseDown = false;
		this.mouseOffset = [ 0, 0 ];
		this.offsetLimits = [ 0, 0 ];

		this.updateOffsetLimits();
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