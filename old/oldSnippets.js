// audo ridimensionare canvas quando ridimensiono

var resizeCanvas_ = function() {
  width = element.offsetWidth;
  height = element.offsetHeight;
  canvas.width = width;
  canvas.height = height;
};





// stampa l'immagine come matrice di numeri
var printImageData = function(imageData) {
  var debug = document.getElementById("debug");
  debug.innerHTML="";
   
  var data = imageData.data;
  for (let i = 0; i< 10000; i+=4)
    {
      let r = data[i]/255;
        let g = data[i+1]/255;
        let b = data[i+2]/255;
        debug.innerHTML += (Math.sqrt( (r*r + g*g + b*b ) / 3)*10).toFixed(0) + " ";
    }

}

// inizializzare la webcam nella pagina (ora lo faccio tramite AR.js)
tracking.initUserMedia_ = function(element, opt_options) {

    window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: (opt_options && opt_options.audio) ? true : false,
    }).then(function(stream) {
      element.srcObject = stream;
    }).catch(function(err) {
      throw Error('Cannot capture user camera.');
    });
};


// gestione animation frame nel tracking
var task = new tracking.TrackerTask(tracker);
task.on('stop', function() {
  window.cancelAnimationFrame(requestId);
});
task.on('run', function() {
});
return task.run();
