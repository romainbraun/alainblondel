var canvas,
	fabricCanvas,
	canvasW,
	canvasH,
	fontSize,
	lineNumber = 15,
	elapsedTime = 0,
	image,
	imageDisplayed = false,
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
setTimeout(displayPicture, 10000);
}

init();

function displayPicture() {
	fabric.Image.fromURL('toiles/toile' + Math.ceil(Math.random() * 6) + '.jpg', function(oImg) {
		imageDisplayed = true;
		image = oImg;
		image.width = image.width * (canvasH / image.height);
		image.height = canvasH;
		image.left = canvasW * 2;
		fabricCanvas.add(image);
		fabricCanvas.moveTo(image,0);
	});
	setTimeout(displayPicture, 30000);
}

function checkPositions() {
	var stopDisplay = false;
	elapsedTime += .1;
	var test = fabricCanvas.getObjects();
	for (var i = 0; i < text.length; i++) {
		if(test[i]) {
			if (test[i].left + test[i].width < - canvasW / 2) {
				fabricCanvas.remove(test[i]);
			}
		}
		if(text[i]) {
			if (text[i].left <= canvasW && !text[i+lineNumber]) {
				console.log(i+lineNumber, text[i+lineNumber]);
				if(!imageDisplayed) {
					console.log('hey');
					addPhrase(i+lineNumber, false);
				} else if (image.left + image.width / 1.2 < canvasW && imageDisplayed) {
					addPhrase(i+lineNumber, true);
					stopDisplay = true;
				}
			}
		}
	}
	if (image) {
		if(stopDisplay) {
			imageDisplayed = false;
		}
		if (image.left + image.width < 0) {
			fabricCanvas.remove(image);
		}
	}
}

function repopulateCanvas() {
	var textLength = text.length;
	console.log('range:',textLength,textLength+lineNumber);
	console.log('repopulate');
	for (var i = 0; i < lineNumber; i++) {
		addPhrase(textLength + i, true);
	}
	imageDisplayed = false;
	console.log('imageDisplayed');
}

function addPhrase(i, repopulate) {
	var color = Math.floor(Math.random() * 150);
	var phrase = new fabric.Text(settings.text[i % settings.text.length], { fontSize: fontSize, fontFamily: 'alainblondelregular', fill: 'rgb('+color+','+color+','+color+')'});
	phrase.top = i % lineNumber * (fontSize);
	phrase.left = canvasW - Math.random() * (canvasW / 2);
	if (text[i-lineNumber]) {
		if (repopulate) {
			phrase.left = canvasW + Math.random() * (canvasW / 2);
		}else {
			phrase.left = text[i-lineNumber].left + text[i-lineNumber].width + 100;
		}
	} else {
		phrase.left =  Math.random() * (canvasW / 2);
	}
	text[i] = phrase;
	fabricCanvas.add(phrase);
}

function slideText() {
	for (var i = 0; i < text.length; i++) {
		if (text[i]) {
			text[i].set('left', text[i].left-3);
		}
	}
	if (image) {
		image.set('left', image.left-3);
	}
	// text.set('left', text.left+1);
	fabricCanvas.renderAll();
	requestAnimationFrame(slideText);
}