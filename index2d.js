var canvas,
	fabricCanvas,
	canvasW,
	canvasH,
	fontSize,
	lineNumber = 15,
	text = [];

function init() {
	canvas = document.getElementById("mainCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    canvasW = canvas.width;
    canvasH = canvas.height;

    fontSize = Math.ceil(canvas.height / lineNumber);

    fabricCanvas = new fabric.StaticCanvas('mainCanvas');
for(var i = 0, textLength = lineNumber * 3; i < textLength; i++) {
	addPhrase(i);
}
requestAnimationFrame(slideText);
setInterval(checkPositions, 100);
}

init();

function checkPositions() {
	var test = fabricCanvas.getObjects();
	for (var i = 0; i < text.length; i++) {
		if(test[i]) {
			if (test[i].left + test[i].width < - canvasW / 2) {
				fabricCanvas.remove(test[i]);
			}
		}
		if(text[i]) {
			if (text[i].left <= canvasW && !text[i+15]) {
				addPhrase(i+15);
			}
		}
	}
}

function addPhrase(i) {
	var color = Math.floor(Math.random() * 150);
	var phrase = new fabric.Text(settings.text[i % settings.text.length], { fontSize: fontSize, fontFamily: 'alainblondelregular', fill: 'rgb('+color+','+color+','+color+')'});
	phrase.top = i % lineNumber * (fontSize);
	phrase.left = canvasW - Math.random() * (canvasW / 2);
	if (text[i-15]) {
		phrase.left = text[i-15].left + text[i-15].getBoundingRect().width + 100;
	} else {
		phrase.left =  Math.random() * (canvasW / 2);
	}
	text[i] = phrase;
	fabricCanvas.add(phrase);
}

function slideText() {
	for (var i = 0; i < text.length; i++) {
		if(text[i]) {
			text[i].set('left', text[i].left-3);

		}
	}
	// text.set('left', text.left+1);
	fabricCanvas.renderAll();
	requestAnimationFrame(slideText);
}