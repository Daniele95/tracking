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
//	var convResult = numgl.convolution(webcamId,[-1,-1,-1,0,0,0,1,1,1]);
  console.log(soglia)
	numgl.threshold(webcamId,soglia)
	numgl.do_it()
    
}
var webcam,canvas, myTrack, myPlane, trovataFaccina;
var position = {x:0, y:0};

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
});

arToolkitSource.init( function onReady() {
  webcam = document.getElementsByTagName('video')[0]
  webcam.classList.add("webcam")
  webcam.id = 'webcam'
  webcam.width = 640
  webcam.height = 480

  numgl.set_fps_element("fps")
  var webcamId = numgl.store_webcam("webcam");  
  numgl.show_canvas(webcamId);

  canvas = document.getElementsByTagName("canvas")[0]
  canvas.width = 640
  webcam.height = 480
  onResize()
  //canvas.style.visibility="hidden"
  //var x = document.getElementsByTagName("BODY")[0];
 // x.addEventListener("load", webGLStart);

  myTrack = new Tracker();
  //myPlane = new Plane();
  //let canvas2 = document.getElementsByTagName('canvas')[1];
  //canvas2.classList.add("tattoo");
  
  console.log(webcamId)



  var result = numgl.convolution(webcamId,[-1,-1,-1,-1,8,-1,-1,-1,-1],25)
  // 1,0,-1,0,0,0,-1,0,1
  // 0,1,0,1,-4,1,0,1,0
  // -1,-1,-1,-1,8,-1,-1,-1,-1
  numgl.threshold(result, 30)
  numgl.rect = {posX:150, posY:80, w:200, h:250}
  
  var canvas222 = document.createElement('canvas');
  canvas222.heigth=400
  canvas222.width=400
  canvas222.classList.add("customCanvasDebug")
  document.body.appendChild(canvas222)

  // modifico lo shader nella funzione fs_code
  numgl.do_it()
// questo chiama numgl.start_loop
// subito prima ho inserito la mia funzione che legge i pixel
// e dovrebbe processarli in ransac

 // console.log(numgl.myPixelData.length)
  
  // onResize()
  // animate();
});



function animate() {
 // myTrack.track(webcam,position);
  if(myTrack.trovataFaccina) {
   // myPlane.draw(position);
  }
  window.requestAnimFrame(animate);
}

function onResize() {  
  webcam.style.width="100%";
  webcam.style.height="100%";
  var ratio = webcam.videoHeight/webcam.videoWidth;
  if(webcam.clientWidth<webcam.clientHeight/ratio) {
    canvas.style.width="100%";  
    canvas.style.height="auto";  
    var offset = webcam.clientHeight/2-webcam.clientWidth*ratio/2
    canvas.style.top=offset+"px"
    canvas.style.left="0px"
  } else {
    canvas.style.height="100%";
    canvas.style.width="auto";  
    var offset = webcam.clientWidth/2-webcam.clientHeight/ratio/2
    canvas.style.left=offset+"px"
    canvas.style.top="0px"
  } 
  canvas.style.opacity ="0.5";
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

