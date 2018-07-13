"use strict";

function Plane() {
   
	//let w = window.innerWidth;
	//let h = canwindowvas.innerHeight;
	let w = canvas.offsetWidth;
	let h = canvas.offsetHeight;
	// scene
	this.scene = new THREE.Scene();
	// camera
	this.camera = new THREE.PerspectiveCamera( 45, w / h, 1, 1000 );
	this.camera.position.set( 0, 0, 800 );
	this.camera.rotation.x = 0 * ( Math.PI / 180 );
	this.scene.add( this.camera );	
	// plane
    var geometry = new THREE.PlaneGeometry( 300, 300 );

	var texture = new THREE.TextureLoader().load( 'tattoo2.png' );
	var material = new THREE.MeshBasicMaterial( { map: texture } );

	this.mesh = new THREE.Mesh( geometry, material );
	this.scene.add( this.mesh );
	// renderer
	this.renderer = new THREE.WebGLRenderer( { alpha: true });
	this.renderer.setSize( w, h );
	this.renderer.domElement.style.position = 'absolute'
	this.renderer.domElement.style.top = '0px'
	this.renderer.domElement.style.left = '0px'
	document.body.appendChild( this.renderer.domElement ); 

}

Plane.prototype.draw = function(position) {
	this.mesh.position.x = (position.x-100)*3;
	this.mesh.position.y = (-position.y+30)*4;
	this.renderer.render( this.scene, this.camera );
}
