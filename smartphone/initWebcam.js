"use strict";
window.onload =function () {
  var old = console.log;
  var logger = document.getElementById('log');
 /* console.log = function (message) {
      if (typeof message == 'object') {
          logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
      } else {
          logger.innerHTML += message + '<br />';
      }
  } */
 
    console.log("ciao")
     slider = document.getElementById('threshold')
}


var slider

function filtri(webcamId, soglia) {
  // Show frames per second.
	// Convolution followed by threshold
//	var convResult = numgl.convolution(webcamId,[-1,-1,-1,0,0,0,1,1,1]);
  console.log(soglia)
	numgl.threshold(webcamId,soglia);
	numgl.do_it();
    
}
var webcam,canvas, myTrack, myPlane, trovataFaccina;
var position = {x:0, y:0};

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
});

arToolkitSource.init( function onReady() {
  webcam = document.getElementsByTagName('video')[0];
  webcam.classList.add("webcam")
  webcam.id = 'webcam'
  webcam.width = 640
  webcam.height = 480


    numgl.set_fps_element("fps");
    var webcamId = numgl.store_webcam("webcam");  
    numgl.show_canvas(webcamId);


  canvas = document.getElementsByTagName("canvas")[0]
  canvas.width = 640
  webcam.height = 480
  onResize()
  //canvas.style.visibility="hidden"
  //var x = document.getElementsByTagName("BODY")[0];
 // x.addEventListener("load", webGLStart);

 // myTrack = new Tracker();
  //myPlane = new Plane();
  //let canvas2 = document.getElementsByTagName('canvas')[1];
  //canvas2.classList.add("tattoo");


	numgl.threshold(webcamId,90);
	numgl.do_it();
slider.oninput = function() {
	numgl.threshold(webcamId,this.value);
	numgl.do_it();
  console.log(this.value)
}

  //onResize()
//  animate();
});



function animate() {
 // myTrack.track(webcam,position);
  if(myTrack.trovataFaccina) {
   // myPlane.draw(position);
  }
  window.requestAnimFrame(animate);
}

function onResize() {  
  webcam.style.width="200px";
  webcam.style.height=200*0.75+"px";
  canvas.style.width="200px";
  canvas.style.height=200*0.75+"px";
}
//window.addEventListener('resize', onResize);

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

