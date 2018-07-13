// Computes the parameters of the line using ransac.
var ransac = function(points, THRESHOLD) {
    if (points.length <= 2) {
      return {a: 0, b: 0, c: 0};
    }
    var count = 0, best = {}, bestCnt = 0;
    for (var iter = 0; iter < 500; ++iter) {
      // Select two points and fit the model.
      var i0 = ~~(Math.random() * (points.length - 1)), i1;
      do {
        i1 = ~~(Math.random() * (points.length - 1));
      } while (i1 == i0);
      var p0 = points[i0], p1 = points[i1];
      // Compute the parameters of the line.
      var slope = (p1.y - p0.y) / (p1.x - p0.x);
      a = -1.0;
      b = 1.0 / slope;
      c = p0.x - p0.y / slope;
      // Count the number of points that fit the model.
      count = 0;
      for (var i = 0; i < points.length; ++i) {
        var point = points[i];
        var dist = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
        if (dist < THRESHOLD) {
          ++count;
        }
      }
      // If more points were classified, break.
      if (bestCnt < count) {
        bestCnt = count;
        best.a = a;
        best.b = b;
        best.c = c;
      }
    }
    return best;
};


// disegna la retta che ha interpolato col ransac
var render = function( ctx, retta, myRect) {
  
  var width = myRect.w; 
  var height = myRect.h;
  a = retta.a;
  b = retta.b;
  c = retta.c;
  // Draw the line.
  ctx.strokeStyle = '#ff0000';
  ctx.beginPath();
  if (Math.abs(b) > 1e-7) {
    ctx.moveTo(
        0,
        (-c - a * 0) / b
    );
    ctx.lineTo(
        width,
        (-c - a * width) / b
    );
  } else {
    ctx.moveTo(
        (-c - b * 0) / a,
        0
    );
    ctx.lineTo(
        (-c - b * height) / a,
        height
    );
  }
  ctx.stroke();
};
