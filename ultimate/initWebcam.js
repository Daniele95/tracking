"use strict";

var webcam,canvas, myTrack, myPlane;
var position = {x:0, y:0};

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
});

var resizeCanvas_ = function() {
  canvas.width = webcam.offsetWidth;
  canvas.height = webcam.offsetWidth;
};

arToolkitSource.init( function onReady() {
  webcam = document.getElementsByTagName('video')[0];
  webcam.classList.add("webcam");
  webcam.id = 'webcam';
  canvas = document.getElementById("canvas");
  onResize();
  
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
window.addEventListener('resize', onResize);

function onResize(){
 // arToolkitSource.onResizeElement()
//  resizeElement(canvas);
    /*let dim = window.innerWidth;

    webcam.style.width = dim+'px';
    webcam.style.height = "auto";

    canvas.style.width = dim+'px'; 
    canvas.style.height = Math.round(dim*0.75)+'px';*/

    resizeElement(webcam, webcam);
    resizeElement(canvas, webcam);
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

function resizeElement (domElement,sourceVideo) {
  var screenWidth = window.innerWidth
  var screenHeight = window.innerHeight

  // sanity check
  ///console.assert(arguments.length === 0)

  // compute sourceWidth, sourceHeight
      var sourceWidth = sourceVideo.videoWidth
      var sourceHeight = sourceVideo.videoHeight
 

  // compute sourceAspect
  var sourceAspect = sourceWidth / sourceHeight
  // compute screenAspect
  var screenAspect = screenWidth / screenHeight

  // if screenAspect < sourceAspect, then change the width, else change the height
  if (screenAspect < sourceAspect) {
      // compute newWidth and set .width/.marginLeft
      var newWidth = sourceAspect * screenHeight
      domElement.style.width = newWidth + 'px'
      domElement.style.marginLeft = -(newWidth - screenWidth) / 2 + 'px'

      // init style.height/.marginTop to normal value
      domElement.style.height = screenHeight + 'px'
      domElement.style.marginTop = '0px'
  } else {
      // compute newHeight and set .height/.marginTop
      var newHeight = 1 / (sourceAspect / screenWidth)
      domElement.style.height = newHeight + 'px'
      domElement.style.marginTop = -(newHeight - screenHeight) / 2 + 'px'

      // init style.width/.marginLeft to normal value
      domElement.style.width = screenWidth + 'px'
      domElement.style.marginLeft = '0px'
  }
}