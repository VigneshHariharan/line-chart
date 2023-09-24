// De Casteljau's algorithm for a quadratic Bezier curve with 3 control points
function deCasteljauQuadratic(points, t) {
  const P0 = points[0];
  const P1 = points[1];
  const P2 = points[2];
  // Calculate intermediate points
  const Q0 = {
    x: P0[0] + (P1[0] - P0[0]) * t,
    y: P0[1] + (P1[1] - P0[1]) * t,
  };
  const Q1 = {
    x: P1[0] + (P2[0] - P1[0]) * t,
    y: P1[1] + (P2[1] - P1[1]) * t,
  };

  // Calculate the point on the curve at parameter t
  const pointOnCurve = [
    Q0.x + (Q1.x - Q0.x) * t,
    Q0.y + (Q1.y - Q0.y) * t,
  ];

  return pointOnCurve;
}

// Example usage:
// const P0 = { x: 50, y: 100 };
// const P1 = { x: 100, y: 50 };
// const P2 = { x: 200, y: 200 };
// const P3 = { x: 250, y: 100 };
// const t = 0.5; // Parameter value between 0 and 1

// const pointOnCurve = deCasteljauCubic(P0, P1, P2, P3, t);
// console.log(pointOnCurve); // This will output the point on the curve at t = 0.5
export default deCasteljauQuadratic;
