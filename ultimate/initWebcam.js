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
  onResize()
 // resizeCanvas_(webcam);
  trackVideo_(webcam);
});

// handle resize
window.addEventListener('resize', function(){
  onResize();
});

function onResize(){
  arToolkitSource.onResizeElement()	
};