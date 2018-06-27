"use strict";

function Plane() {
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
	this.scene = new THREE.Scene();
	// camera
	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	this.camera.position.set( 0, - 450, 400 );
	this.camera.rotation.x = 45 * ( Math.PI / 180 );
	this.scene.add( this.camera );
	// plane
    var geometry = new THREE.PlaneGeometry( 300, 300 );

	var texture = new THREE.TextureLoader().load( 'tatto.png' );
	// immediately use the texture for material creation
	var material = new THREE.MeshBasicMaterial( { map: texture } );

    //plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 3500), material);
    //plane.material.side = THREE.DoubleSide;
    //plane.position.x = 100;
    //var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    
	this.mesh = new THREE.Mesh( geometry, material );
	this.scene.add( this.mesh );
	// renderer
	this.renderer = new THREE.WebGLRenderer( { alpha: true });
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.domElement.style.position = 'absolute'
	this.renderer.domElement.style.top = '0px'
	this.renderer.domElement.style.left = '0px'
	document.body.appendChild( this.renderer.domElement ); 

}

Plane.prototype.draw = function(position) {
	this.mesh.position.x = position.x;
	this.mesh.position.y = -position.y;
	this.renderer.render( this.scene, this.camera );
}
