"use strict";

function clearCanvas(context){
  var myData = context.getImageData(0,0,canvas.width,canvas.height);
  for(let i = 0; i<myData.data.length;i++) 
    myData.data[i] = 0;
  context.putImageData(myData,0,0);
}

function rendiRossa(imageData) {  
  for (var i = 0; i<imageData.data.length; i+=4 ) {
    imageData.data[i+1] =0;
    imageData.data[i+2] =0;
  }
}

function filtraZona(context, myRect) {
  var imageData = context.getImageData(myRect.posX, myRect.posY, myRect.w, myRect.h);
  imageData = Sobel(imageData).toImageData();
  imageData.points = [];
  var thresh = document.getElementById("threshold").value;
  imageData = threshold(imageData, imageData.points, thresh, myRect);
  return imageData;
}

function contaPunti(imageData, myRect) {
  var dir = {nord:0, sud:0, est:0, ovest:0};
  let deltaY = Math.round(myRect.h/5.5);
  let deltaX = Math.round(myRect.w/5.5);
  for(var i = 0; i<imageData.points.length; i++) {
    if(imageData.points[i].y<myRect.h-deltaY)
      dir.nord++;
    if(imageData.points[i].y>deltaY)
      dir.sud++;
    if(imageData.points[i].x>deltaX)
      dir.est++;
    if(imageData.points[i].x<myRect.w-deltaX)
      dir.ovest++;
    }
  return dir;
}

function fitTriplo(imageData,ctx, myRect) {
  var points = imageData.points;

  var pLeft = [];
  for (let i = 0; i < points.length; i++ )
    if (points[i].x > Math.round(myRect.h/4) && points[i].y < Math.round(myRect.w/2))
      pLeft.push({ x: points[i].x, y: points[i].y });

  var retta = ransac(pLeft, 1);
  render(ctx, retta, myRect);
}

function trackVideo_(element) {

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  let myRect = {posX:140, posY:100, w:120, h:200};
  var facciaRiconosciuta = false;
  document.getElementById("riconosciuto").addEventListener("click", function(){
      facciaRiconosciuta = true;
  });

  var requestAnimationFrame_ = function() {
      
    clearCanvas(context);
    // disegno il feed della webcam nella mia canvas
    context.drawImage(element, 0, 0, canvas.width, canvas.height);
    
    // applico i filtri alla canvas
    // qui associo a imageData l'attributo POINTS che poi uso in contaPunti e nel fitTriplo
    var imageData = filtraZona(context, myRect);
    rendiRossa(imageData);
    context.putImageData(imageData, 0, 0);

    // controllo dov'è la faccina rispetto a dove ho lasciato il rettangolo
    var dir = contaPunti(imageData, myRect);
    fitTriplo(imageData,context, myRect);

    if(facciaRiconosciuta == true) {
        myRect.posY += Math.round((-dir.nord+dir.sud)/100);
        myRect.posX += Math.round((dir.est-dir.ovest)/100);
    }

    // disegno il rettangolo
    context.strokeRect(myRect.posX, myRect.posY, myRect.w, myRect.h);
    
    
    var frameNumber = window.requestAnimationFrame(function() {
      requestAnimationFrame_();
    });
    
  };
    
  requestAnimationFrame_();
};
  