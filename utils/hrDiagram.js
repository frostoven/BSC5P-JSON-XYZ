// Note: not currently used as development on `averageOutLuminosityInfo.js` has
// been paused.

import { lerp } from './mathUtils';

// Converts a subclass number (0-9) to degrees kelvin. The limit (9) can be
// overidden as it's not the same for all types. For example, Y dwarfs are
// classified 0-2 and S-types are classified 0-10.
function subclassToKelvin(tempMin, tempMax=null, subclassNum, limit=9) {
  if (tempMax === null) {
    // Wolf-Rayet stars.
    return tempMin;
  }
  // Take the inverse percentage of 0-9. Example, 2 will become 78% hot.
  const inversePerc = Math.abs((subclassNum / limit) - 1);
  return lerp(tempMin, tempMax, inversePerc);
}

// Temperatures are very difficult to decide because every source I've found
// provides vastly different values. I'm guessing then that precision isn't
// really a thing here, and numbers are provided on a best-effort bases. I
// provide the links that helped most me here:
// * https://sites.uni.edu/morgans/astro/course/Notes/section2/spectraltemps.html
// * https://en.wikipedia.org/wiki/Stellar_classification
// * https://www.britannica.com/science/stellar-classification#ref288671
// * https://en.wikipedia.org/wiki/F-type_main-sequence_star
const type = {
  O: [ 30000, 100000 ],
  B: [ 10000, 30000 ],
  A: [ 7500, 10000 ],
  F: [ 6000, 7500 ],
  G: [ 5200, 6000 ],
  K: [ 3700, 5200 ],
  M: [ 2400, 3700 ],
  L: [ 1500, 2400 ], // Brown dwarf.
  T: [ 800, 1500 ], // Brown dwarf.
  Y: [ 300, 800 ], // Brown dwarf made of water and ammonia. Human temperature.
  WN2: [ 141000, null ],
  WN3: [ 85000, null ],
  WN4: [ 70000, null ],
  WN5: [ 60000, null ],
  WN5h: [ 50000, null ],
  WN6: [ 56000, null ],
  WN6h: [ 45000, null ],
  WN7: [ 50000, null ],
  WN7h: [ 45000, null ],
  WN8: [ 45000, null ],
  WN8h: [ 40000, null ],
  WN9h: [ 35000, null ],
  WO2: [ 200000, null ],
  WC4: [ 117000, null ],
  WC5: [ 83000, null ],
  WC6: [ 78000, null ],
  WC7: [ 71000, null ],
  WC8: [ 60000, null ],
  WC9: [ 44000, null ],
};
