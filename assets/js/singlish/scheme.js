// Modified from ~> https://stackoverflow.com/questions/35027010
BuildableElement = function () {
	function _el() {
		var self = this, ele, rt;

		this.parent = function(i = 1) {
			while(i > 0) {
				ele = ele.parentNode;
				--i;
			}
			return this;
		};

		this.withRoot = function(el) {
			rt = el;
			ele = rt;
			return this;
		}

		this.add = function (tag) {
			if(ele) {
				var _el = document.createElement(tag);
				ele.appendChild(_el);
				ele = _el;
			}
			else {
				ele = document.createElement(tag);
				rt = ele;
			}
			
			return this;
		};

		this.byId = function (id) {
			ele = document.getElementById(id);
			return this;
		};

		this.byClass = function (cl) {
			ele = document.getElementsByClassName(cl);
			return this;
		};

		this.withId = function (name) {
			ele.id = name;
			return this;
		};

		this.withClass = function (...names) {
			for(var name of names) {
				ele.className += ' ' + name;
			}
			return this;
		};

		this.withStyles = function (style) {
			_this.setCSS(ele, style);
			return this;
		};

		this.withHtml = function (str) {
			ele.innerHTML = str;
			return this;
		};

		this.append = function (parent) {
			if (parent.nodeType === 1) {
				parent.appendChild(rt);
			}

			return rt;
		};

		this.toElem = function () {
			return rt;
		};

		return this;
	}
	return new _el();
};

var scheme = {
	'vowels': [
		{
			'a': '\u0D85',
			'aa': '\u0D86'
		},
		{
			'A': '\u0D87',
			'Aa': '\u0D88'
		},
		{
			'i': '\u0D89',
			'ii': '\u0D8A'
		},
		{
			'u': '\u0D8B',
			'uu': '\u0D8C'
		},
		{
			'e': '\u0D91',
			'ee': '\u0D92'
		},
		{
			'I': '\u0D93',
			'o': '\u0D94'
		},
		{
			'oo': '\u0D95',
			'au': '\u0D96'
		},
		{
			'a\\n': '\u0D85\u0D82',
			'a\\h': '\u0D85\u0D83'
		}
	],
	'auxiliaries': [
		{
			'Rm': '\u0DBB\u0DCA\u200D\u0DB8',
			'DhY': '\u0DB0\u0DCA\u200D\u0DBA'
		},
		{
			'kRu': '\u0D9A\u0DD8',
			'kRuu': '\u0D9A\u0DF2'
		},
		{
			'chau': '\u0DA0\u0DDE',
			'mI': '\u0DB8\u0DDB'
		}
	],
	'nasals': [
		{
			'nnda': '\u0DAC'
		},
		{
			'nndha': '\u0DB3'
		},
		{
			'nnga': '\u0D9F'
		},
		{
			'mmba': '\u0DB9'
		}
	],
	'consonants': [
		{
			'k': '\u0D9A',
			'g': '\u0D9C',
			'ch': '\u0DA0'
		},
		{
			'j': '\u0DA2',
			't': '\u0DA7',
			'd': '\u0DA9'
		},
		{
			'th': '\u0DAD',
			'dh': '\u0DAF',
			'n': '\u0DB1'
		},
		{
			'N': '\u0DAB',
			'p': '\u0DB4',
			'b': '\u0DB6'
		},
		{
			'm': '\u0DB8',
			'y': '\u0DBA',
			'r': '\u0DBB'
		},
		{
			'l': '\u0DBD',
			'L': '\u0DC5',
			'v': '\u0DC0'
		},
		{
			's': '\u0DC3',
			'h': '\u0DC4',
			'K': '\u0D9B'
		},
		{
			'G': '\u0D9D',
			'Ch': '\u0DA1',
			'J': '\u0DA3'
		},
		{
			'T': '\u0DA8',
			'D': '\u0DAA',
			'Th': '\u0DAE'
		},
		{
			'Dh': '\u0DB0',
			'P': '\u0DB5',
			'B': '\u0DB7'
		},
		{
			'sh': '\u0DC1',
			'Sh': '\u0DC2',
			'f': '\u0DC6'
		},
		{
			'KN': '\u0DA5',
			'GN': '\u0DA4',
			'Lu': '\u0DC5\u0DD4'
		},
		{
			'Luu': '\u0DC5\u0DD6',
			'\Na': '\u0D9E',
			'Ru': '\u0D8D'
		}
	],
	'deriving': [
		{
			'ka': '\u0D9A',
			'kaa': '\u0D9A\u0DCF'
		},
		{
			'kA': '\u0D9A\u0DD0',
			'kAa': '\u0D9A\u0DD1'
		},
		{
			'ki': '\u0D9A\u0DD2',
			'kii': '\u0D9A\u0DD3'
		},
		{
			'ku': '\u0D9A\u0DD4',
			'kuu': '\u0D9A\u0DD6'
		},
		{
			'kI': '\u0D9A\u0DDB',
			'ko': '\u0D9A\u0DDC'
		},
		{
			'koo': '\u0D9A\u0DDD',
			'kau': '\u0D9A\u0DDE'
		},
		{
			'kra': '\u0D9A\u0DCA\u200D\u0DBB',
			'kraa': '\u0D9A\u0DCA\u200D\u0DBB\u0DCF'
		},
		{
			'krA': '\u0D9A\u0DCA\u200D\u0DBB\u0DD0',
			'krAa': '\u0D9A\u0DCA\u200D\u0DBB\u0DD1'
		},
		{
			'kri': '\u0D9A\u0DCA\u200D\u0DBB\u0DD2',
			'krii': '\u0D9A\u0DCA\u200D\u0DBB\u0DD3'
		},
		{
			'krI': '\u0D9A\u0DCA\u200D\u0DBB\u0DDB',
			'kro': '\u0D9A\u0DCA\u200D\u0DBB\u0DDC'
		},
		{
			'kroo': '\u0D9A\u0DCA\u200D\u0DBB\u0DDD',
			'krau': '\u0D9A\u0DCA\u200D\u0DBB\u0DDE'
		}
	]
};

var content = document.getElementById('content');

for(var type in scheme) {
	var table = new BuildableElement()
					.add('table')
					.withClass('scheme', 'scheme-seg')
					.toElem();

	for (var i in scheme[type]) {
		var tr = document.createElement('tr');

		for(var tag in scheme[type][i]) {
			new BuildableElement()
				.withRoot(tr)
				.add('td')
				.withHtml(scheme[type][i][tag])
				.parent()
				.add('td')
				.withHtml(tag);
		}

		table.appendChild(tr);
	}

	var li = new BuildableElement()
			.add('li')
			.withHtml(type.charAt(0).toUpperCase() + type.slice(1))
			.toElem();

	li.appendChild(table);

	content.appendChild(li);
}

// Make the DIV element draggable:
dragElement(document.getElementById("translit-scheme"));

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "-title")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "-title").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

var toggleScheme = document.getElementById("toggle-scheme");
var contentList = document.getElementById('content');

toggleScheme.onclick = () => {
	toggleScheme.classList.toggle('fa-caret-right');
	toggleScheme.classList.toggle('fa-caret-down');
	contentList.classList.toggle('hidden');
};