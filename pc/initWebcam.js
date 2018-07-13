"use strict";

window.onload =function () {
  var old = console.log;
  var logger = document.getElementById('log');
  console.log = function (message) {
      if (typeof message == 'object') {
          logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
      } else {
          logger.innerHTML += message + '<br />';
      }
  }
}

var webcam,canvas, myTrack, myPlane, trovataFaccina;
var position = {x:0, y:0};

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
});

arToolkitSource.init( function onReady() {
  webcam = document.getElementsByTagName('video')[0];
  webcam.classList.add("webcam");
  webcam.id = 'webcam';
  canvas = document.getElementById("canvas");

  onResize()

  myTrack = new Tracker();
  myPlane = new Plane();
  let canvas2 = document.getElementsByTagName('canvas')[1];
  canvas2.classList.add("tattoo");

  animate();
});

function animate() {
  myTrack.track(webcam,position);
  if(myTrack.trovataFaccina) {
    myPlane.draw(position);
  }
  window.requestAnimFrame(animate);
}

function onResize() {  
  webcam.style.width="800px";
  canvas.style.width="800px";
  webcam.style.height="500px";
  canvas.style.height="500px";
}
window.addEventListener('resize', onResize);

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

  var sourceWidth = sourceVideo.videoWidth
  var sourceHeight = sourceVideo.videoHeight
  var sourceAspect = sourceWidth / sourceHeight
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