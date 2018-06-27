"use strict";

function clearCanvas(context,canvas){
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


function Tracker(element,position) {

  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  this.framesIsFalse = 0;
  
  let px = Math.round(canvas.offsetWidth/ 8);
  let py = Math.round(canvas.offsetHeight/ 8);
  let sx = Math.round(canvas.offsetWidth/ 4);
  let sy = Math.round(canvas.offsetHeight/ 4);
  //this.myRect = {posX:140, posY:100, w:120, h:200};
  this.myRect = {posX:px, posY:py, w:sx, h:sy};
  this.myRectOld = this.myRect;
  
  this.riconoscimentoFaccia = true;
  document.getElementById("riconosciuto").addEventListener("click", function(){
    this.riconoscimentoFaccia = true;
  });
}

Tracker.prototype.track = function() {
      
    let context = this.context;
    let canvas = this.canvas;
    let framesIsFalse = this.framesIsFalse;
    let myRect = this.myRect;
    let riconoscimentoFaccia = this.riconoscimentoFaccia;

    clearCanvas(context,canvas);
    // disegno il feed della webcam nella mia canvas
    let webcam = document.getElementsByTagName('video')[0];


    context.drawImage(webcam,0,0,300,150);

    
    var myData = context.getImageData(0,0,canvas.width,canvas.height);
    rendiRossa(myData);
    context.putImageData(myData,0,0);
    context.globalAlpha = 0.5 ;
    
    
    // applico i filtri alla canvas
    // qui associo a imageData l'attributo POINTS che poi uso in contaPunti e nel fitTriplo
    var imageData = filtraZona(context, myRect);
    rendiRossa(imageData);

    // controllo dov'è la faccina rispetto a dove ho lasciato il rettangolo
    var dir = contaPunti(imageData, myRect);
    var trovataFaccina = fitTriplo(imageData,context, myRect);

    if(riconoscimentoFaccia == true && trovataFaccina == true) {
        context.putImageData(imageData, 0, 0);

        myRect.posY += Math.round((-dir.nord+dir.sud)/100);
        myRect.posX += Math.round((dir.est-dir.ovest)/100);
        if(myRect.posY < 0) myRect.posY = 0;
        if(myRect.posY > canvas.height-myRect.h) myRect.posY = canvas.height-myRect.h;
        if(myRect.posX < 0) myRect.posX = 0;
        if(myRect.posX > canvas.width-myRect.w) myRect.posX = canvas.width-myRect.w;
        framesIsFalse = 0;
        position.x = myRect.posX;
        position.y = myRect.posY;

    } else framesIsFalse++;
    if(framesIsFalse > 40) this.myRect = this.myRectOld;

    // disegno il rettangolo
    context.strokeRect(myRect.posX, myRect.posY, myRect.w, myRect.h);

};
