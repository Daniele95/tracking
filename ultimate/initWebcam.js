"use strict";

var webcam,canvas, myTrack, myPlane;
var position = {x:0, y:0};

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
});

var resizeCanvas_ = function(element,canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

arToolkitSource.init( function onReady() {
  webcam = document.getElementsByTagName('video')[0];
  webcam.classList.add("webcam");
  webcam.id = 'webcam';

  // Show frames per second.
  numgl.set_fps_element("fps");
  var webcamId = numgl.store_webcam("webcam");  

  numgl.show_canvas(webcamId);
  numgl.grey(webcamId);
  numgl.do_it();


  let canvas = document.getElementById("canvas");
  onResize()


  myTrack = new Tracker();
  myPlane = new Plane();
  let canvas2 = document.getElementsByTagName('canvas')[1];
  canvas2.classList.add("tattoo");

  animate();
});

function animate() {
  myTrack.track(webcam,position);
  myPlane.draw(position);
  window.requestAnimFrame(animate);
}

// handle resize
window.addEventListener('resize', function(){
  onResize();
  resizeCanvas_();
});

function onResize(){
  arToolkitSource.onResizeElement()
};


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
    