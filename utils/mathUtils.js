// Linear interpolation.
function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

// Formula that converts brightness and distance into absolute magnitude.
function calculateAbsoluteMagnitude(apparentBrightness, distance) {
  return apparentBrightness - 5 * Math.log10(distance / 10);
}

// Converts degrees to radians.
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Converts degrees to decimal.
function degToDecimal(degrees, minute, second) {
  let sign = 1;
  if (degrees < 0) {
    sign = -1;
  }

  const decimal = Math.abs(degrees) + (Math.abs(minute) / 60) + (Math.abs(second) / 3600);
  return decimal * sign;
}

// Converts right ascension to degrees.
function raToDecimal(hour, minute, second) {
  return (hour + (minute / 60) + (second / 3600)) * 15;
}

// Converts right ascension to radians.
function raToRadians(hour, minute, second) {
  return (raToDecimal(hour, minute, second) * Math.PI) / 180;
}

// Converts declination to radians.
function decToRadians(degrees, minute, second) {
  return (degToDecimal(degrees, minute, second) * Math.PI) / 180;
}

function convertCoordsToRadians({ rightAscension, declination }) {
  //
}

// I would really like to get the following working in future. I know it's
// *nearly* correct, but something in is wrong and produces bad results.
// So. Many. Coordinate. Systems.
// function raDecToAzAlt(ra, decl) {
//   const hourAngle = ((lst - ra) + 360) % 360;
//
//   const x = Math.cos(hourAngle * (Math.PI / 180)) * Math.cos(decl * (Math.PI / 180));
//   const y = Math.sin(hourAngle * (Math.PI / 180)) * Math.cos(decl * (Math.PI / 180));
//   const z = Math.sin(decl * (Math.PI / 180));
//
//   const xHor = x * Math.cos((90 - lat) * (Math.PI / 180)) - z * Math.sin((90 - lat) * (Math.PI / 180));
//   const yHor = y;
//   const zHor = x * Math.sin((90 - lat) * (Math.PI / 180)) + z * Math.cos((90 - lat) * (Math.PI / 180));
//
//   console.log('debug horizon:',{xHor,yHor,zHor});
//
//   const az = Math.atan2(yHor, xHor) * (180 / Math.PI) + 180;
//   const alt = Math.asin((zHor) * (180 / Math.PI));
//
//   return { az, alt };
// }

export {
  lerp,
  calculateAbsoluteMagnitude,
  convertCoordsToRadians,
  raToDecimal,
  degToDecimal,
  raToRadians,
  decToRadians,
}
