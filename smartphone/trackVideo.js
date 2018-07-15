"use strict";

var debug = true;

function clearCanvas(imageData) {
  for (var i = 0; i<imageData.data.length; i+=4 ) {
    imageData.data[i+1] =0;
    imageData.data[i+2] =0;
    imageData.data[i+3] =0;
  }
}

function rendiRossa(imageData) {  
  for (var i = 0; i<imageData.data.length; i+=4 ) {
    imageData.data[i+1] =0;
    imageData.data[i+2] =0;
  }
}

function filtraZona(imageData) {
  imageData = Sobel(imageData).toImageData();
  imageData.points = [];
  var thresh = document.getElementById("threshold").value;
  imageData = threshold(imageData, imageData.points, thresh);
  return imageData;
}

function contaPunti(imageData) {
  var dir = {nord:0, sud:0, est:0, ovest:0};
  let deltaY = Math.round(imageData.height/5.5);
  let deltaX = Math.round(imageData.width/5.5);
  for(var i = 0; i<imageData.points.length; i++) {
    if(imageData.points[i].y<imageData.height-deltaY)
      dir.nord++;
    if(imageData.points[i].y>deltaY)
      dir.sud++;
    if(imageData.points[i].x>deltaX)
      dir.est++;
    if(imageData.points[i].x<imageData.width-deltaX)
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
    if(debug) {
      render(ctx, rettaLeft, myRect);
      render(ctx, rettaRight, myRect);
      render(ctx, rettaTop, myRect);    
    } 
    return true;
  }
  else return false;
}




function Tracker(element,position) {

  this.canvas = document.getElementsByTagName("canvas")[0]
  

  this.framesIsFalse = 0;
  this.trovataFaccina = false;
  
  //let px = Math.round(window.innerWidth/ 16);
  //this.myRect = {posX:px, posY:py, w:sx, h:sy};
  this.myRect = {posX:150, posY:80, w:60, h:70};
  this.myRectOld = this.myRect;

}

Tracker.prototype.track = function() {
    let context = this.context;
    let canvas = this.canvas;
    let myRect = this.myRect;
    
/*
    clearCanvas(context.getImageData(0,0,canvas.width,canvas.height));
    
    // disegno il feed della webcam nella mia canvas
    let webcam = document.getElementsByTagName('video')[0];
    context.drawImage(webcam,0,0,300,150);
    //context.globalAlpha = 0.5;
    
    // Sobel + Soglia
    // qui associo a imageData l'attributo POINTS che poi uso in contaPunti e nel fitTriplo
    var imageData = filtraZona(context.getImageData(
      myRect.posX, myRect.posY, myRect.w, myRect.h));

    // controllo dov'è la faccina rispetto a dove ho lasciato il rettangolo
    var dir = contaPunti(imageData);
    this.trovataFaccina = fitTriplo(imageData,context, myRect);

    if(this.trovataFaccina == true) {
        if(debug) context.putImageData(imageData, 0, 0);  

        myRect.posY += Math.round((-dir.nord+dir.sud)/100);
        myRect.posX += Math.round((dir.est-dir.ovest)/100);
        if(myRect.posY < 0) myRect.posY = 0;
        if(myRect.posY > canvas.height-myRect.h) myRect.posY = canvas.height-myRect.h;
        if(myRect.posX < 0) myRect.posX = 0;
        if(myRect.posX > canvas.width-myRect.w) myRect.posX = canvas.width-myRect.w;
        this.framesIsFalse = 0;
        position.x = myRect.posX;
        position.y = myRect.posY;

  } else this.framesIsFalse++;

  if(this.framesIsFalse > 40)  {
      this.myRect = this.myRectOld;
      this.trovataFaccina = false;
  }

  // disegno il rettangolo
  if(debug)context.strokeRect(myRect.posX, myRect.posY, myRect.w, myRect.h);
*/
};
