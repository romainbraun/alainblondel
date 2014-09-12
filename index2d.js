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

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 10);
          };
})();

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
	window.addEventListener("mousemove", function (options) {
		mouseX = options.x;
		mouseY = options.y;
		
	});
	requestAnimationFrame(slideText);
	setInterval(checkPositions, 100);
}

init();

function displayPicture() {
	fabric.Image.fromURL('toiles/toile' + Math.ceil(Math.random() * 6) + '.jpg', function(oImg) {
		imageDisplayed = true;
		if (image) {
			fabricCanvas.remove(image);
		}
		image = oImg;
		image.width = image.width * (canvasH / image.height);
		image.height = canvasH;
		image.left = canvasW + canvasW / 2;
		fabricCanvas.add(image);
		fabricCanvas.moveTo(image,0);
	});
}

function checkPositions() {
	// console.log(fabricCanvas.getZoom());
	
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
	text[i] = phrase;
	fabricCanvas.add(phrase);
}

function slideText() {
	var speed = textSpeed * (mouseX / (canvasW));
	if (speed < minSpeed) speed = minSpeed;
	elapsedFrames++;
	for (var i = 0; i < text.length; i++) {
		if (text[i]) {
			text[i].set('left', text[i].left-speed);
			// text[i].set('scaleX',mouseY/canvasH + 1);
			// text[i].set('scaleY',mouseY/canvasH + 1);
		}
	}
	if (image) {
		image.set('left', image.left-speed);
	}
	if(elapsedFrames % (30 * 60) === 0) {
		displayPicture();
	}
	// fabricCanvas.zoomToPoint(canvasCenter, 1 + ((mouseY / canvasH)) / 4);
	fabricCanvas.renderAll();
	requestAnimationFrame(slideText);
}

