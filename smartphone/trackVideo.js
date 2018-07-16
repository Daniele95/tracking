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

var readPixels = function() {

  var posY = numgl.gl.drawingBufferHeight-numgl.rect.h-numgl.rect.posY
  var pixels = new Uint8Array(numgl.rect.w *numgl.rect.h * 4)
  numgl.gl.readPixels( numgl.rect.posX,posY,numgl.rect.w,numgl.rect.h, numgl.gl.RGBA, numgl.gl.UNSIGNED_BYTE, pixels);
  numgl.myPixelData = pixels


  var pixels_ridotto = []
  for (var i=0; i<pixels.length; i+=4)
    pixels_ridotto.push(pixels[i]/4) 


  var canvas = document.getElementsByTagName("canvas")[0]
  canvas.width=numgl.rect.w;  
  canvas.height = numgl.rect.h;  
  var ctx = canvas.getContext("2d");
  
  var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);


  if(! debug) {
    var canvas0 = document.getElementsByTagName("canvas")[1]
    canvas0.style.visibility="hidden"
    canvas.style.visibility="hidden"
  }
  for(var i=0; i<pixels.length; i+=4) {
    imgData.data[i] = pixels_ridotto[pixels_ridotto.length-i/4]*255.
    imgData.data[i+3]=255
  }
  
  ctx.putImageData( imgData,0,0 )
  //

  // controllo dov'è la faccina rispetto a dove ho lasciato il rettangolo
  var dir = contaPunti(pixels_ridotto,numgl.rect)

  var trovataFaccina = fitTriplo(pixels_ridotto,ctx, numgl.rect)

  if(trovataFaccina== true) {
      numgl.rect.posY += Math.round((-dir.nord+dir.sud)/100)
      numgl.rect.posX += Math.round((dir.est-dir.ovest)/100)
      if(numgl.rect.posY < 0) numgl.rect.posY = 0
      if(numgl.rect.posY > canvas.height-numgl.rect.h) numgl.rect.posY = canvas.height-numgl.rect.h;
      if(numgl.rect.posX < 0) numgl.rect.posX = 0;
      if(numgl.rect.posX > canvas.width-numgl.rect.w) numgl.rect.posX = canvas.width-numgl.rect.w;
      //  this.framesIsFalse = 0;
      position.x = numgl.rect.posX;
      position.y = numgl.rect.posY;

  }/* else this.framesIsFalse++;

if(this.framesIsFalse > 40)  {
   this.myRect = this.myRectOld;
   this.trovataFaccina = false;
}
*/
// disegno il rettangolo
//if(debug)context.strokeRect(myRect.posX, myRect.posY, myRect.w, myRect.h);

}

function contaPunti(pixelsData, rect) {
  var dir = {nord:0, sud:0, est:0, ovest:0}
  let deltaY = Math.round(rect.h/5.5)
  let deltaX = Math.round(rect.w/2.)
  for(var i = 0; i<pixelsData.length; i++) {
    if(pixelsData[i]>0) {
      var yCoord = Math.floor ( i / rect.w ) // divisione intera
      var xCoord = Math.max( Math.floor( i - yCoord*rect.w ), 0 )
      
      if(yCoord>rect.h-deltaY)
        dir.nord++;
      if(yCoord<deltaY)
        dir.sud++;
      if(xCoord>deltaX)
        dir.est++;
      if(xCoord<rect.w-deltaX)
        dir.ovest++;
      }
    } 

  return dir;
}



var fitTriplo = function(points,ctx, myRect) {

  var top = Math.round(myRect.h/3);
  var center = Math.round(myRect.w/2);

  var pLeft = [];
  var pRight = [];
  var pTop = [];
  for (let i = 0; i < points.length; i++ ) {
    if (points[i].y > top && points[i].x < center )
      pLeft.push({ x: points[i].x, y: points[i].y })
    if (points[i].y > top && points[i].x > center )
      pRight.push({ x: points[i].x, y: points[i].y })
    if (points[i].y < top)
      pTop.push({ x: points[i].x, y: points[i].y })
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

};
