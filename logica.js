
"strict"
 
  

function getT() {
  var d = new Date();
  var n = d.getMilliseconds()/10;
  return n;
}

function copyArray(data) {
  dati = new Uint8ClampedArray();
  for(i=0; i<data.length;i++)
  	dati[i] = data;
  return dati;
}

function copyImageData(d) {
  return new ImageData(d.data, d.width, d.height);
}

function filtri (imageData, ctx,canvas, myRect) {
 // sobel(imageData,ctx, myRect.px, myRect.py); // <--------------
  imageData = ctx.getImageData(myRect.px, myRect.py, myRect.w, myRect.h);
  var points = [];
 // threshold(imageData,ctx,points,1,myRect);  // <--------------
  for (i = 0; i<points.length; i++) {
  	points[i].x += myRect.px;
  	points[i].y += myRect.py;    
  }
  var THRESHOLD = 10;
  var retta = ransac(points,THRESHOLD);
  render(points, canvas,retta, THRESHOLD,myRect);// <--------------
}


  
 function fit(ctx,canvas) {
  // beccapunti
  ctx = canvas.getContext('2d');
  myRect = {px:200+getT(), py:450+getT(), w: 150, h: 80};
  imageData = ctx.getImageData(myRect.px, myRect.py, myRect.w, myRect.h);
  
  myRect2 = {px:200+getT(), py:350+getT(), w: 50, h: 120};
  imageData2 = ctx.getImageData(myRect2.px, myRect2.py, myRect2.w, myRect2.h);
  
  myRect3 = {px:300+getT(), py:330+getT(), w: 50, h: 120};
  imageData3 = ctx.getImageData(myRect3.px, myRect3.py, myRect3.w, myRect3.h);
  //ctx.getImageData, ctx.putImageData,
  
  ctx.fillStyle="black";
 // ctx.fillRect(0,0,canvas.width,canvas.height);
  filtri (imageData, ctx,canvas, myRect)
  filtri (imageData2, ctx,canvas, myRect2)
  filtri (imageData3, ctx,canvas, myRect3)
  
  //
 }

function colora(ctx) {
  
 imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  data = imageData.data;
  for (i = 0; i<data.length; i+=4) {
  	dati[i] = Math.floor(i/4/canvas.width);
  }
  ctx.putImageData(imgData,0,0);
}
function disegna(tracker) {
  ctx.drawImage(img, getT(), getT());
  //data = imgData.data; // data è una reference a imgData.data
  //colora(ctx); 
  ctx.getImageData(0,0,canvas.width,canvas.height);
  fit(ctx,canvas);
 // tracking.track(canvas, tracker );
  window.requestAnimationFrame(disegna);
}
var img = new Image();
var canvas = document.getElementById('video');  
var ctx = canvas.getContext('2d');
var canvas2 = document.getElementById('video');  
var context = canvas.getContext('2d');

function getColorDistance(target, actual) {
  return Math.sqrt(
    (target.r - actual.r) * (target.r - actual.r) +
    (target.g - actual.g) * (target.g - actual.g) +
    (target.b - actual.b) * (target.b - actual.b)
  );
}

function drawRect(rect, color,ctx) {
  canvas = document.getElementById('video');  
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle="#FF0000";
 // context.strokeStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

window.onload = function() {
  // tracking
  var color = {r: 255, g: 255, b: 255};
  tracking.ColorTracker.registerColor('dynamic', function(r, g, b) {
    return getColorDistance(color, {r: r, g: g, b: b}) < 10000
  });
  
  tracking.ColorTracker.registerColor('white', function(r, g, b) {
    var thresholdGreen = 50,
      thresholdBlue = 70,
      dx = r - 255,
      dy = g - 255,
      dz = b - 255;

    if ((g - r) >= thresholdGreen && (b - r) >= thresholdBlue) {
      return true;
    }
    return dx * dx + dy * dy + dz * dz < 6400;
  });
  
  var tracker = new tracking.ColorTracker('white');
  tracker.on('track', function(e) {
    
    if (e.data.length !== 0) {
      e.data.forEach(function(rect) {
        console.log(rect);
        drawRect(rect, color);
      });
    }
    
  });
  
  //
  
  img.src = 'arm2.jpg'; 
  
  img.onload = function() {
    canvas = document.getElementById('video');  
    ctx = canvas.getContext('2d');
    imgData = ctx.getImageData(0,0,canvas.width, canvas.height);  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
    
    disegna();
    
   // tracker.trackColor_(imgData.data, canvas.width, canvas.height, 'white');
    tracking.track(canvas, tracker );
    
    //fit(ctx,canvas);



    //ctx.rect(200,380,60,100); ctx.stroke();
    //for(i = 0; i<data.length/3; i++) data[i] = 0;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //console.time('fz');
    //fz()
    //console.timeEnd('fz');

  };
};
