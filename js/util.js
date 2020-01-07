//Some useful functions

class util {

	static hexToDec( hex ) {
		let l = hex.length;
		let num = 0;

		for( let i = 0; i < l; i++ ) {
			let c = hex[l-i-1];
			let pow = Math.pow(16, i);

			switch( c ) {
				case 'f': num += 15*pow; break;
				case 'e': num += 14*pow; break;
				case 'd': num += 13*pow; break;
				case 'c': num += 12*pow; break;
				case 'b': num += 11*pow; break;
				case 'a': num += 10*pow; break;
				default : num += parseInt( c )*pow;
			}
		}

		return num;
	}
}