"use strict";

var webcam = null;

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType : 'webcam',
});

var resizeCanvas_ = function(element) {
  let width = element.offsetWidth;
  let height = element.offsetHeight;
  canvas.width = width;
  canvas.height = height;
};

arToolkitSource.init( function onReady() {
  webcam = document.getElementsByTagName('video')[0];
  webcam.classList.add("webcam");
  onResize()
 // resizeCanvas_(webcam);
  var position = {x:0, y:0};
  trackVideo_(webcam, position);
  drawPlane(position);
  let canvas2 = document.getElementsByTagName('canvas')[1];
  canvas2.classList.add("tattoo");
});

// handle resize
window.addEventListener('resize', function(){
  onResize();
});

function onResize(){
  arToolkitSource.onResizeElement()	
};