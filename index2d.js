var canvas,
	fabricCanvas,
	canvasW,
	canvasH,
	canvasCenter,
	fontSize,
	lineNumber = 25,
	elapsedTime = 0,
	elapsedFrames = 0,
	image,
	imageDisplayed = false,
	mouseX,
	mouseY,
	referenceTextSpeed = 3,
	imageTextSpeed = 1.3,
	textSpeed = 3,
	minSpeed = 2,
	text = [];

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function init() {
	canvas = document.getElementById("mainCanvas");
    canvas.width = document.body.clientWidth / 2;
    canvas.height = document.body.clientHeight / 2;
    canvasW = canvas.width;
    canvasH = canvas.height;

    mouseX = canvasW / 2;
    mouseY = canvasH / 2;

    fontSize = Math.ceil(canvas.height / lineNumber);

    fabricCanvas = new fabric.StaticCanvas('mainCanvas');
    fabricCanvas.skipTargetFind = true;
    fabricCanvas.renderOnAddRemove=false;
    canvasCenter = new fabric.Point(fabricCanvas.getCenter().left,fabricCanvas.getCenter().top);
	for(var i = 0, textLength = lineNumber * 2; i < textLength; i++) {
		addPhrase(i);
	}
	// window.addEventListener("mousemove", function (options) {
	// 	mouseX = options.x || options.clientX;
	// 	mouseY = options.y || options.clientY;
		
	// });
	requestAnimationFrame(slideText);
	setInterval(checkPositions, 100);

	preloadImages(0);
}

init();

function preloadImages(image) {
	console.log(image);
	var img = new Image();
	img.onload = function () {
		preloadImages(image+1);
	};
	if (image < 40) {
		img.src = 'toiles/final/' + image + '.jpg';
		document.getElementById('percent').innerHTML = Math.ceil(image / 39 * 100);
	} else {
		var loader = document.getElementsByClassName('loading')[0];
		loader.className = loader.className + " hidden"; 
		displayPicture();
	}
}

function displayPicture() {
	setTimeout(function () {
		fabric.Image.fromURL('toiles/final/' + Math.floor(Math.random() * 40) + '.jpg', function(oImg) {
			imageDisplayed = true;
			image = oImg;
			image.width = image.width * (canvasH / image.height);
			image.height = canvasH;
			image.left = canvasW + canvasW / 4;
			fabricCanvas.add(image);
			fabricCanvas.moveTo(image,0);
		});
	}, 8000);
}

function checkPositions() {
	
	var stopDisplay = false;
	elapsedTime += 0.1;
	var test = fabricCanvas.getObjects();
	for (var i = 0; i < text.length; i++) {
		if(test[i]) {
			if (test[i].left + test[i].width < - canvasW / 2) {
				fabricCanvas.remove(test[i]);
			}
		}
		if(text[i]) {
			if (text[i].left + text[i].width - 50 <= canvasW && !text[i+lineNumber]) {
				if(!imageDisplayed) {
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
			image = null;
			displayPicture();
			
		} else if (imageDisplayed) {
			if (textSpeed >= imageTextSpeed) {
				textSpeed -= 0.04;
			}
		}
		if (!imageDisplayed) {
			if (textSpeed <= referenceTextSpeed) {
				textSpeed += 0.04;
			}
		}
	}
}

function addPhrase(i, repopulate) {
	var color = Math.floor(Math.random() * 150);
	var phrase = new fabric.Text(settings.text[i % settings.text.length], { centeredScaling: true, fontSize: fontSize, fontFamily: 'alainblondelregular', fill: 'rgb('+color+','+color+','+color+')'});
	phrase.top = i % lineNumber * (fontSize) + Math.random() * 20 - 10;
	phrase.left = canvasW - Math.random() * (canvasW / 2);
	if (text[i-lineNumber]) {
		if (repopulate) {
			phrase.left = canvasW + Math.random() * (canvasW / 2);
		}else {
			phrase.left = text[i-lineNumber].left + text[i-lineNumber].width + Math.random() * 100 - 50;
		}
	} else {
		phrase.left =  Math.random() * (canvasW / 2);
	}
	phrase.scaleX = Math.random() * 0.4 + 0.8;
	text[i] = phrase;

	fabricCanvas.add(phrase);
}

function slideText() {
	// var speed = textSpeed;
	// if (speed < minSpeed) speed = minSpeed;
	// if (imageDisplayed) {
	// 	speed = speed / 1.5;
	// }
	elapsedFrames++;
	for (var i = 0; i < text.length; i++) {
		if (text[i]) {
			text[i].set('left', text[i].left-textSpeed);
			// text[i].set('scaleX',mouseY/canvasH + 1);
			// text[i].set('scaleY',mouseY/canvasH + 1);
		}
	}
	if (image) {
		image.set('left', image.left-textSpeed);
	}
	// if(elapsedFrames % (16 * 60) === 0) {
	// 	displayPicture();
	// }
	// fabricCanvas.zoomToPoint(canvasCenter, 1 + ((mouseY / canvasH)) / 4);
	fabricCanvas.renderAll();
	requestAnimationFrame(slideText);
}

