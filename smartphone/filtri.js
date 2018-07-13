
  var sobel = function(imageData,ctx, posX, posY) {
    var sobelData = Sobel(imageData);
    var sobelImageData = sobelData.toImageData();
    ctx.putImageData(sobelImageData, posX, posY);
  };
  

  var threshold = function(imageData, points, thresh) {
    data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      r = data[i]/255;
      g = data[i+1] / 255;
      b = data[i+2] / 255;
      yCoord = Math.floor ( ( (i+1)/4 ) / imageData.width ); // divisione intera
      xCoord = Math.max( Math.floor( ( (i+1)/4 ) - yCoord*imageData.width ), 0 );
      // scurisco i bordi      
      if (xCoord == 0 || xCoord == imageData.width-1) {
        data[i] = data[i+1] = 0;
        data[i+2] = 0;
      } //
      else if ( Math.sqrt(r*r + g*g + b*b) < thresh) {
        data[i] = data[i+1] = data[i+2] = 0;
      }
      else {
      	data[i] = data[i+1] = data[i+2] = 255;
        points.push({ x: xCoord, y: yCoord });    
      }
    }
    return imageData;
  };
 