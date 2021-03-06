// GLOBAL VARIABLES

var renderer, container, scene, loader, mesh1, mesh2, mesh3, mesh4, mesh5, terrain, myTarget, camera, cam1, cam2, con1, con2, clock, stats;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;

VIEW_ANGLE = 60,
ASPECT = WIDTH / HEIGHT,
NEAR = 10,
FAR = 12000;

var camera_cw = false;
var camera_ccw = false;

var lights_cw = true;
var lights_ccw = false;

// BUTTON INITIALIZATIONS

$( 'input#light1' ).addClass( 'active' );
$( 'input#light2' ).bootstrapToggle('off');
$( 'input#light3' ).bootstrapToggle('off');

$( 'button#lighta' ).addClass( 'active' );

$( 'button#camerab' ).addClass( 'active' );

$( 'input#layer1' ).addClass( 'active' );
$( 'input#layer2' ).addClass( 'active' );
$( 'input#layer3' ).addClass( 'active' );

$( 'button#controlb' ).addClass( 'active' );

$( 'input#vr-mode' ).bootstrapToggle('off');

// FUNCTIONS

var axis = new THREE.Vector3( 0, 1, 0 );
var camRadIncrement = 0;
var lightRadIncrement = 0;
var rad = 1000*(2*Math.PI/360);

function update() {
 	delta = clock.getDelta();

 	if ( camera_cw ){
 		camRadIncrement += delta * rad;

		camera.position.x = 3820 * Math.cos( camRadIncrement );
		camera.position.y = 2000;
		camera.position.z = 3820 * Math.sin( camRadIncrement );
 	}
 	if ( camera_ccw ){
 		camRadIncrement -= delta * rad;

		camera.position.x = 3820 * Math.cos( camRadIncrement );
		camera.position.y = 2000;
		camera.position.z = 3820 * Math.sin( camRadIncrement );
 	}
}

function animate() {
	requestAnimationFrame( animate );
	stats.begin();
	renderer.render( scene, camera );
	controls.update( clock.getDelta() );
	update();
	stats.end();
	//stats.update();
}

function toggleControls() {
	if ( $( 'button#controla' ).hasClass( 'active' ) ) {
		setControlsOrbit();
		$( 'div#instructions p' ).replaceWith("<p>left mouse: rotate<br>middle mouse: zoom<br>right mouse: pan</p>");
	}
	if ( $( 'button#controlb' ).hasClass( 'active' ) ) {
		setControlsFirstPerson();
		$( 'div#instructions p' ).replaceWith("<p>left mouse: forward<br>right mouse: back<br>WASD: forward/left/back/right<br>RF: up/down</p>");
	}
}

function setControlsFirstPerson() {
	var prevCamera = camera;
	cam1.position.copy( prevCamera.position );
    camera = cam1;
    con1.lon = 180 + 360*prevCamera.rotation.y/(2*Math.PI);
    controls = con1;
}

function setControlsOrbit() {
	var prevCamera = camera;
	cam2.position.copy( prevCamera.position );
    cam2.rotation.copy( prevCamera.rotation );
    camera = cam2;

    controls = con2;
}

function onWindowResize() {
	var win = $( this );
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
	renderer.setSize( WIDTH, HEIGHT );
}

// MAIN PROGRAM

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
if( Detector.webgl ){
	renderer = new THREE.WebGLRenderer({
		antialias: true,				// to get smoother output
		preserveDrawingBuffer: true		// to allow screenshot
	});
	renderer.setClearColor( 0xd6e7fb, 1.0 );
} else {
	renderer = new THREE.CanvasRenderer();
}
renderer.setSize( WIDTH, HEIGHT );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMapEnabled = false;

container = document.getElementById( '3d' );
container.appendChild( renderer.domElement );

scene = new THREE.Scene();

loader = new THREE.JSONLoader();

loader.load('rac-model-json/rac-environment.js', function ( geometry, materials ) {
	mesh1 = new THREE.Mesh(
		geometry, new THREE.MeshFaceMaterial( materials )
	);

	mesh1.rotation.x = -Math.PI / 2;
	scene.add( mesh1 );
});

loader.load('rac-model-json/rac-environment-grass.js', function ( geometry, materials ) {
	mesh2 = new THREE.Mesh(
		geometry, new THREE.MeshFaceMaterial( materials )
	);

	mesh2.rotation.x = -Math.PI / 2;
	scene.add( mesh2 );
});

loader.load('rac-model-json/rac-structure.js', function ( geometry, materials ) {
	mesh3 = new THREE.Mesh(
		geometry, new THREE.MeshFaceMaterial( materials )
	);

	mesh3.rotation.x = -Math.PI / 2;
	scene.add( mesh3 );
});

loader.load('rac-model-json/rac-facade.js', function ( geometry, materials ) {
	mesh4 = new THREE.Mesh(
		geometry, new THREE.MeshFaceMaterial( materials )
	);

	mesh4.rotation.x = -Math.PI / 2;
	scene.add( mesh4 );
});

loader.load('rac-model-json/rac-facade-windows.js', function ( geometry, materials ) {
	mesh5 = new THREE.Mesh(
		geometry, new THREE.MeshFaceMaterial( materials )
	);

	mesh5.rotation.x = -Math.PI / 2;
	scene.add( mesh5 );
});

loader.load('rac-model-json/rac-interior.js', function ( geometry, materials ) {
	mesh6 = new THREE.Mesh(
		geometry, new THREE.MeshFaceMaterial( materials )
	);

	mesh6.rotation.x = -Math.PI / 2;
	scene.add( mesh6 );
});

var myTarget = new THREE.Object3D();
myTarget.position.set( 600, 400, 0 );

light = new THREE.HemisphereLight( 0xffffff, 0xd6e7fb, 1.0 );
scene.add( light );

cam1 = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
con1 = new THREE.FirstPersonControls( cam1 );
con1.lookSpeed = 0.10;
con1.movementSpeed = 1000;

cam2 = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
cam2.position.set( 2600, 1500, 2000 );
cam2.lookAt( myTarget.position );
con2 = new THREE.OrbitControls( cam2 );
con2.minDistance = 50;
con2.maxDistance = 6000;
con2.minPolarAngle = Math.PI/8;
con2.maxPolarAngle = 5*Math.PI/8;
camera = cam2;
controls = con2;
$( 'div#instructions p' ).replaceWith("<p>left mouse: rotate<br>middle mouse: zoom<br>right mouse: pan</p>");

scene.add( myTarget );
scene.add( camera );

window.addEventListener( 'resize', onWindowResize, false );

clock = new THREE.Clock();

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
stats.domElement.style.right = '0px';
container.appendChild( stats.domElement );

animate();

// BUTTONS

$( 'button#cameraa' ).click( function() {
	if( !$( 'button#cameraa' ).hasClass( 'active' ) ){
		$( 'button#cameraa' ).addClass( 'active' );
		$( 'button#camerab' ).removeClass( 'active' );
		$( 'button#camerac' ).removeClass( 'active' );
		camera_cw = true;
		camera_ccw = false;
	}
});

$( 'button#camerab' ).click( function() {
	if( !$( 'button#camerab' ).hasClass( 'active' ) ){
		$( 'button#cameraa' ).removeClass( 'active' );
		$( 'button#camerab' ).addClass( 'active' );
		$( 'button#camerac' ).removeClass( 'active' );
		camera_cw = false;
		camera_ccw = false;
	}
});

$( 'button#camerac' ).click( function() {
	if( !$( 'button#camerac' ).hasClass( 'active' ) ){
		$( 'button#cameraa' ).removeClass( 'active' );
		$( 'button#camerab' ).removeClass( 'active' );
		$( 'button#camerac' ).addClass( 'active' );
		camera_cw = false;
		camera_ccw = true;
	}
});

$( 'a#view1' ).click( function() {
	camera.position.set( 0, 1000, 2000 );
	myTarget.position.set( 1200, 400, 0 );
	camera.lookAt( myTarget.position );
	controls.target = myTarget.position;
	$( 'button#cameraa' ).removeClass( 'active' );
	$( 'button#camerab' ).addClass( 'active' );
	$( 'button#camerac' ).removeClass( 'active' );
	camera_cw = false;
	camera_ccw = false;
});

$( 'a#view2' ).click( function() {
	camera.position.set( 600, 200, 200 );
	myTarget.position.set( 1800, 200, 0 );
	camera.lookAt( myTarget.position );
	controls.target = myTarget.position;
	$( 'button#cameraa' ).removeClass( 'active' );
	$( 'button#camerab' ).addClass( 'active' );
	$( 'button#camerac' ).removeClass( 'active' );
	camera_cw = false;
	camera_ccw = false;
});

$( 'a#view3' ).click( function() {
	camera.position.set( 2600, 1500, 2000 );
	myTarget.position.set( 600, 400, 0 );
	camera.lookAt( myTarget.position );
	controls.target = myTarget.position;
	$( 'button#cameraa' ).removeClass( 'active' );
	$( 'button#camerab' ).addClass( 'active' );
	$( 'button#camerac' ).removeClass( 'active' );
	camera_cw = false;
	camera_ccw = false;
});

$( 'input#layer1' ).change( function() {
	if( $( 'input#layer1' ).hasClass( 'active' ) ){
		$( 'input#layer1' ).removeClass( 'active' );
		scene.remove( mesh3 );
	} else {
		$( 'input#layer1' ).addClass( 'active' );
		scene.add( mesh3 );
	}
});

$( 'input#layer2' ).change( function() {
	if( $( 'input#layer2' ).hasClass( 'active' ) ){
		$( 'input#layer2' ).removeClass( 'active' );
		scene.remove( mesh4 );
		scene.remove( mesh5 );
	} else {
		$( 'input#layer2' ).addClass( 'active' );
		scene.add( mesh4 );
		scene.add( mesh5 );
	}
});

$( 'input#layer3' ).change( function() {
	if( $( 'input#layer3' ).hasClass( 'active' ) ){
		$( 'input#layer3' ).removeClass( 'active' );
		scene.remove( mesh6 );
	} else {
		$( 'input#layer3' ).addClass( 'active' );
		scene.add( mesh6 );
	}
});

$( 'button#controla' ).click( function() {
	if( !$( 'button#controla' ).hasClass( 'active' ) ){
		toggleControls();
		$( 'button#controla' ).addClass( 'active' );
		$( 'button#controlb' ).removeClass( 'active' );
	}
});

$( 'button#controlb' ).click( function() {
	if( !$( 'button#controlb' ).hasClass( 'active' ) ){
		toggleControls();
		$( 'button#controla' ).removeClass( 'active' );
		$( 'button#controlb' ).addClass( 'active' );
	}
});

$( 'input#vr-mode' ).change( function() {
	if( $( 'input#vr-mode' ).hasClass( 'active' ) ){
		$( 'input#vr-mode' ).removeClass( 'active' );
	} else {
		$( 'input#vr-mode' ).addClass( 'active' );
	}
});

$( 'div#LightsMenu' ).click( function() {
	$( 'div#cameramenu' ).collapse('hide');
	$( 'div#layersmenu' ).collapse('hide');
	$( 'div#controlsmenu' ).collapse('hide');
});

$( 'div#CameraMenu' ).click( function() {
	$( 'div#lightsmenu' ).collapse('hide');
	$( 'div#layersmenu' ).collapse('hide');
	$( 'div#controlsmenu' ).collapse('hide');
});

$( 'div#LayersMenu' ).click( function() {
	$( 'div#cameramenu' ).collapse('hide');
	$( 'div#lightsmenu' ).collapse('hide');
	$( 'div#controlsmenu' ).collapse('hide');
});

$( 'div#ControlsMenu' ).click( function() {
	$( 'div#cameramenu' ).collapse('hide');
	$( 'div#layersmenu' ).collapse('hide');
	$( 'div#lightsmenu' ).collapse('hide');
});
