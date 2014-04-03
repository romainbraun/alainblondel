var scene 			= new THREE.Scene(),
	camera 			= new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
	renderer 		= new THREE.WebGLRenderer(),
	textMaterial 	= new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: true } ),
	group 			= new THREE.Object3D(),
	mouseY			= 0,
	mouseX			= 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;


document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	for (var i = 0, wordLength = settings.text.length; i < wordLength; ++i) {
		var text3d = new THREE.TextGeometry( settings.text[i], {
			size: 10,
			height: 2,
			curveSegments: 2,
			font: "helvetiker"
		});
		var text = new THREE.Mesh(text3d, textMaterial);
		group.add(text);
		text.position.x = Math.random() * 800 - 400;
		text.position.y = Math.random() * 200 - 100;
		text.position.z = Math.random() * 100 + 200;
	}

	// group.add( text );
	scene.add( group );

	

	camera.position.set( 0, 0, 500 );

	render();
	console.log(group);
}

function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;
}

function toScreenXY( position, camera, div ) {
    var pos = position.clone();
    projScreenMat = new THREE.Matrix4();
    projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
    projScreenMat.multiplyVector3( pos );

    var offset = findOffset(div);

    return { x: ( pos.x + 1 ) * div.width / 2 + offset.left,
         y: ( - pos.y + 1) * div.height / 2 + offset.top };

}
function findOffset(element) { 
	var pos = new Object();
	pos.left = pos.top = 0;        
	if (element.offsetParent) { 
		do { 
		  pos.left += element.offsetLeft; 
		  pos.top += element.offsetTop; 
		} while (element = element.offsetParent); 
	} 
	return pos;
} 

function render() {
	requestAnimationFrame(render);

	for (var i = 0, groupLength = group.children.length; i < groupLength; ++i) {
		group.children[i].position.x -= 5;
		if (toScreenXY(group.children[i].position, camera, renderer.domElement).x < -2000) {
			group.children[i].position.x = 500;
		}
	}
	
	camera.position.z = mouseY / 200 + 400;
	camera.position.x = mouseX / 500;
	camera.lookAt(new THREE.Vector3(0,0,0));

	//console.log(toScreenXY(group.children[0].position, camera, renderer.domElement));

	renderer.render(scene, camera);
}

init();