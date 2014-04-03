var scene 			= new THREE.Scene(),
	camera 			= new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
	renderer 		= new THREE.WebGLRenderer(),
	textMaterial 	= new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: true } ),
	text3d 			= new THREE.TextGeometry( 'hello', {
						size: 80,
						height: 20,
						curveSegments: 2,
						font: "helvetiker"
					}),
	text 			= new THREE.Mesh( text3d, textMaterial ),
	group 			= new THREE.Object3D();


function init() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	group.add( text );
	scene.add( group );

	text.position.x = 0;
	text.position.y = 0;
	text.position.z = 0;

	camera.position.set( 0, 0, 500 );

	render();
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

init();