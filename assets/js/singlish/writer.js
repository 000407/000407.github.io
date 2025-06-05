var IGNORE_KEYCODES = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];
var MARKUP_PATTERN = /(\\)?[a-zA-Z]+([^a-zA-Z]{1})?/;
var CONSONANTS = /^((\\[nhNRJ])|(R?[bBcCdDfgGhjJkKlLmnNpPqsStTvwy])|(r))/;
var SP_CONSONANTS = /^\\[nhNRJ]/;
var CEREBRALS = /^[bcCdDgkpsStT]h/;
var SP_CEREBRALS = /^[GK]N/;
var NASALISED = /^(nnd(h)?|nng|mmb)/;
var VOWELS = /^((a[au]?)|(ee?)|(ii?)|(oo?)|(uu?)|(Aa?)|I)/;
var SP_CHARS = /^Ruu?/;

function parse(e, elem) {
	if(IGNORE_KEYCODES.includes(e.keyCode)) {
		console.log('Ignoring keycode ' + e.keyCode);
		return;
	}

	var fulltext = elem.value;

	var literals = getLiterals();
	var caretPos = getCaretPosition(elem);
	
	var singlishText = fulltext.substr(0, caretPos);
	var initMatches = singlishText.match(MARKUP_PATTERN);

	if(!initMatches) {
		return;
	}

	var prefix = fulltext.slice(0, initMatches['index']);
	singlishText = initMatches[0];
	var suffix = fulltext.slice(prefix.length + singlishText.length);

	var matches = singlishText.match(MARKUP_PATTERN);

	if(!matches) {
		console.log("No parsable text found.");
		return;
	}

	var tempText = matches[0];

	if(m = tempText.match(VOWELS)) {
		if(tempText.length <= 1) {
			return;
		}
		
		var key = m[0];

		if (key.length > 1) {
			caretPos -= key.length - 1;
		}
		
		if(literals[key]) {
			singlishText = singlishText.replace(key, literals[key]);
		}
	}
	
	else if(mc = tempText.match(CONSONANTS)) {
		var translit = [];
		if(tempText.length <= 2 && !tempText.match(/[^a-zA-Z]$/)) {
			flushParseResult(elem, prefix, singlishText, suffix);
			return;
		}

		var consonant = mc[0];
		var hal_able = true;

		if(m = tempText.match(NASALISED)) {
			console.log('NASALISED');
			consonant = m[0];
		}

		else if(m = tempText.match(SP_CONSONANTS)) {
			console.log('SP_CONSONANT');
			consonant = m[0];
			hal_able = false;
		}

		else if(m = tempText.match(SP_CEREBRALS)) {
			console.log('SP_CEREBRAL');
			consonant = m[0];
		}

		else if(m = tempText.match(CEREBRALS)) {
			console.log('CEREBRAL');
			consonant = m[0];
		}

		else {
			console.log('CONSONANT');
		}

		translit.push(consonant);

		var modifier = '';
		var yansaya = 0;
		var rakaransha = 0;
		var repaya = 0;

		if(tempText.substr(consonant.length).startsWith('Y')) {
			yansaya = 1;
			translit.push('Y');
		}

		else if(tempText.substr(consonant.length).startsWith('r')) {
			rakaransha = 1;
			translit.push('r');
		}

		if(tempText.endsWith('R')) {
			repaya = 1;
		}

		var prefixLength = consonant.length + yansaya + rakaransha;

		if (m = tempText.substr(prefixLength).match(VOWELS)) {
			modifier = m[0];
		}

		else if (m = tempText.substr(prefixLength).match(SP_CHARS)) {
			if(tempText.length <= 3) {
				return;
			}
			modifier = m[0];
		}

		prefixLength += repaya;

		prefixLength += modifier.length;
		var nextChars = tempText.substr(prefixLength);
		
		if((!modifier || modifier.length <= 1) && !nextChars && !repaya) {
			return;
		}

		translit.push(modifier);

		if(repaya) {
			translit.push('R');
		}

		var sinhala = literals[consonant]
					+ (yansaya ? literals['Y'] : '')
					+ (rakaransha ? literals['rr'] : '')
					+ (repaya ? literals['R'] : '')
					+ (literals['modifiers'][modifier ? modifier : hal_able ? 'hal' : 'none']);

		singlishText = singlishText.replace(translit.join(''), sinhala);

		tempText = nextChars;
	}

	flushParseResult(elem, prefix, singlishText, suffix);
}

function flushParseResult(elem, prefix, singlishText, suffix) {
	elem.value = prefix + singlishText + suffix;
	elem.selectionEnd = prefix.length + singlishText.length;
}

function getLiterals() {
	return {
		aa:'\u0D86',
		Aa:'\u0D88',
		ii:'\u0D8A',
		uu:'\u0D8C',
		ee:'\u0D92',
		oo:'\u0D95',
		au:'\u0D96',
		a:'\u0D85',
		A:'\u0D87',
		i:'\u0D89',
		u:'\u0D8B',
		e:'\u0D91',
		o:'\u0D94',
		I:'\u0D93',

		modifiers: {
			oo:'\u0DDD',
			aa:'\u0DCF',
			Aa:'\u0DD1',
			ii:'\u0DD3',
			ee:'\u0DDA',
			uu:'\u0DD6',
			au:'\u0DDE',
			a:'',
			A:'\u0DD0',
			i:'\u0DD2',
			e:'\u0DD9',
			u:'\u0DD4',
			o:'\u0DDC',
			I:'\u0DDB',
			hal:'\u0DCA',

			//Special characters
			Ru:'\u0DD8',
			Ruu:'\u0DF2',
			none: ''
		},

		

		//Special consonants
		'\\n': '\u0D82',
		'\\h': '\u0D83',
		'\\N': '\u0D9E',
		'\\R': '\u0D8D',
		'\\J': '\u0DA6',

		//Consonants
		k:'\u0D9A',
		K:'\u0D9B',
		g:'\u0D9C',
		G:'\u0D9D',
		nng:'\u0D9F',
		ch:'\u0DA0',
		Ch:'\u0DA1',
		j:'\u0DA2',
		J:'\u0DA3',
		KN:'\u0DA4',
		GN:'\u0DA5',
		t:'\u0DA7',
		T:'\u0DA8',
		d:'\u0DA9',
		D:'\u0DAA',
		N:'\u0DAB',
		nnd:'\u0DAC',
		th:'\u0DAD',
		Th:'\u0DAE',
		dh:'\u0DAF',
		Dh:'\u0DB0',
		n:'\u0DB1',
		nndh:'\u0DB3',
		p:'\u0DB4',
		P:'\u0DB5',
		b:'\u0DB6',
		B:'\u0DB7',
		m:'\u0DB8',
		mmb:'\u0DB9',
		y:'\u0DBA',
		r:'\u0DBB',
		l:'\u0DBD',
		v:'\u0DC0',
		w:'\u0DC0',
		sh:'\u0DC1',
		Sh:'\u0DC2',
		s:'\u0DC3',
		h:'\u0DC4',
		L:'\u0DC5',
		Lu:'\u0DC5\u0DD4',
		f:'\u0DC6',
		kr: '\u0D9A\u0DCA\u200D\u0DBB',

		Y:'\u0DCA\u200D\u0DBA',
		rr: '\u0DCA\u200D\u0DBB',
		R: '\u0DBB\u0DCA\u200D'
	};
}

function getCaretPosition (oField) {
	// Initialize
	var iCaretPos = 0;

	// IE Support
	if (document.selection) {

		// Set focus on the element
		oField.focus();

		// To get cursor position, get empty selection range
		var oSel = document.selection.createRange();

		// Move selection start to 0 position
		oSel.moveStart('character', -oField.value.length);

		// The caret position is selection length
		iCaretPos = oSel.text.length;
	}

	// Firefox support
	else if (oField.selectionStart || oField.selectionStart == '0'){
		iCaretPos = oField.selectionDirection=='backward' ? oField.selectionStart : oField.selectionEnd;
	}

	// Return results
	return iCaretPos;
}

$(document).ready(function(){
	var container = $("#writer-container");

	var cols = Math.floor(container.prop('clientWidth') / 7.2);
	var rows = Math.floor(container.prop('clientHeight') / 3);

	var elem = document.getElementById("typearea");
	elem.cols = cols;
	elem.rows = rows;
});