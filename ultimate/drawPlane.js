function drawPlane(position) {
    /*
    // RequestAnimationFrame shim
	window.requestAnimFrame = ( function( callback ) {
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function ( callback ) {
			window.setTimeout( callback, 1000 / 60 );
		};
    })();
    */
	// scene
	var scene = new THREE.Scene();
	// camera
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, - 450, 400 );
	camera.rotation.x = 45 * ( Math.PI / 180 );
	scene.add( camera );
	// plane
    var geometry = new THREE.PlaneGeometry( 300, 300 );

    // assuming you want the texture to repeat in both directions:
    var texture,material;
    texture = THREE.ImageUtils.loadTexture( "tattoo.png" );


    material = new THREE.MeshLambertMaterial({ map : texture });
    //plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 3500), material);
    //plane.material.side = THREE.DoubleSide;
    //plane.position.x = 100;
    //var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	// renderer
	var renderer = new THREE.WebGLRenderer( { alpha: true });
	renderer.setSize( 640, 480 );
	document.body.appendChild( renderer.domElement );   
	animate();
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		mesh.position.x = position.x;
		mesh.position.y = -position.y;
		renderer.render( scene, camera );
    }
    
}