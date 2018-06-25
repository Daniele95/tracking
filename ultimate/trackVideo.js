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

var fitTriplo = function(imageData,ctx, myRect) {
  var points = imageData.points;

  var top = Math.round(myRect.h/3);
  var center = Math.round(myRect.w/2);

  var pLeft = [];
  var pRight = [];
  var pTop = [];
  for (let i = 0; i < points.length; i++ ) {
    if (points[i].y > top && points[i].x < center )
      pLeft.push({ x: points[i].x, y: points[i].y });
    if (points[i].y > top && points[i].x > center )
      pRight.push({ x: points[i].x, y: points[i].y });
    if (points[i].y < top)
      pTop.push({ x: points[i].x, y: points[i].y });
  }

  var rettaLeft = ransac(pLeft, 1)
  var rettaRight = ransac(pRight, 1)
  var rettaTop = ransac(pTop, 1)

  let mLeft = Math.round(rettaLeft.a/rettaLeft.b);
  let mRight = Math.round(rettaRight.a/rettaRight.b);
  let mTop = rettaTop.a/rettaTop.b;
  
  if (Math.abs(mLeft) > 5 && Math.abs(mRight) > 5 && Math.abs(mTop) < 0.9) {    
    render(ctx, rettaLeft, myRect);
    render(ctx, rettaRight, myRect);
    render(ctx, rettaTop, myRect);
    return true;
  }
  else return false;
}



function trackVideo_(element) {

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  let myRect = {posX:140, posY:100, w:120, h:200};
  var riconoscimentoFaccia = false;
  document.getElementById("riconosciuto").addEventListener("click", function(){
    riconoscimentoFaccia = true;
  });

  var requestAnimationFrame_ = function() {
      
    clearCanvas(context);
    // disegno il feed della webcam nella mia canvas
    context.drawImage(element, 0, 0, canvas.width, canvas.height);
    
    // applico i filtri alla canvas
    // qui associo a imageData l'attributo POINTS che poi uso in contaPunti e nel fitTriplo
    var imageData = filtraZona(context, myRect);
    rendiRossa(imageData);

    // controllo dov'è la faccina rispetto a dove ho lasciato il rettangolo
    var dir = contaPunti(imageData, myRect);
    var trovataFaccina = fitTriplo(imageData,context, myRect);
    console.log(trovataFaccina);

    if(riconoscimentoFaccia == true && trovataFaccina == true) {

        context.putImageData(imageData, 0, 0);

        myRect.posY += Math.round((-dir.nord+dir.sud)/100);
        myRect.posX += Math.round((dir.est-dir.ovest)/100);
        if(myRect.posY < 0) myRect.posY = 0;
        if(myRect.posY > canvas.height-myRect.h) myRect.posY = canvas.height-myRect.h;
        if(myRect.posX < 0) myRect.posX = 0;
        if(myRect.posX > canvas.width-myRect.w) myRect.posX = canvas.width-myRect.w;
    }

    // disegno il rettangolo
    context.strokeRect(myRect.posX, myRect.posY, myRect.w, myRect.h);
    
    
    var frameNumber = window.requestAnimationFrame(function() {
      requestAnimationFrame_();
    });
    
  };
    
  requestAnimationFrame_();
};
  