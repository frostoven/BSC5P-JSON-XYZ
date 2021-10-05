import { lerp } from './mathUtils';

// Temperatures are very difficult to decide because every source I've found
// provides vastly different values. I'm guessing then that precision isn't
// really a thing here, and numbers are provided on a best-effort bases. I
// provide the links that helped most me here:
// * https://sites.uni.edu/morgans/astro/course/Notes/section2/spectraltemps.html
// * https://en.wikipedia.org/wiki/Stellar_classification
// * https://www.britannica.com/science/stellar-classification#ref288671
// * https://en.wikipedia.org/wiki/F-type_main-sequence_star
// * http://www.astronomy.ohio-state.edu/~ryden/ast162_2/notes8.html
// * https://theplanets.org/types-of-stars/dwarf-star/
//
// It's also worth noting that temperature ranges per star class are slightly
// different for different luminosity classes, so this really is a loose
// approximation. This is especially true of stars that are not main sequence
// (~10% of stars).
//
// Some stat approximations for the Milky Way:
// * 90% of stars are main sequence
// * 9.6% are white dwarfs.
// * 0.4% are giants
// * 0.0001% are supergiants.
// + Red dwarfs will probably eventually become a theoretical blue dwarfs.
//   These do not exist yet as the galaxy is too young for that kind of star.
// + 75% of the stars in the galaxy will eventually end up as white dwarfs.
const tempRanges = [
  /* O */ [ 30000, 100000 ],
  /* B */ [ 10000, 30000 ],
  /* A */ [ 7500, 10000 ],
  /* F */ [ 6000, 7500 ],
  /* G */ [ 5200, 6000 ],
  /* K */ [ 3700, 5200 ],
  /* M */ [ 2400, 3700 ],
  /* L */ [ 1500, 2400 ], // Brown dwarf.
  /* T */ [ 800, 1500 ], // Brown dwarf.
  /* Y */ [ 300, 800 ], // Brown dwarf made of water and ammonia. Human temperature.
];

// Special provisions:
// * White dwarfs are between 8k and 40k. Most of their life however is spent
//   cooler, rather than hotter. They can drop below 4k, but this is rare (more
//   due to the low age of the universe than anything else, though).
// * Red dwarfs are between 3.5k and 6.38k. May not need listing here.
// * Brown dwarfs are 1k or below. May not need listing here.
// * Wolf-Rayet stars have very specific temperatures.
const specialRanges = {
  // D: [ 10000, null ], // White dwarf. Happy medium; produces expected colour.
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

/**
 * Written to dynamically find numbers in tempRange above. Ideally I'd use a
 * logarithm with a single range instead, but star temperature isn't exactly
 * logarithmic (in fact, I cannot figure out the distribution). This function
 * allows specifying a range that follows any pattern you want (whether
 * logarithmic, mixed / interfered sine waves, or no structure at all) and
 * finds target number based on a distance from 1% to 100%.
 * @param {array} array - An array containing 2-length arrays. Each 2-length
 *   array is a range from x-y (may be small-big, or big-small).
 * @param {number} percentage - 0 - 100.
 * @param {number} [scale] - This is the array's length by default. If
 *   specified, shifts the perceived 'end' point.
 * @returns {*}
 */
function getNumberInNestedRange(array, percentage, scale) {
  const arrayLen = array.length;
  if (typeof scale === 'undefined') {
    scale = arrayLen;
  }
  // percentage = percentage / 100;
  const index = Math.ceil((arrayLen * (percentage)) - 1);
  const relativePos = (scale * (percentage)) - index;
  const range = array[index];
  return lerp(range[0], range[1], relativePos);
}

function estimateTemperatureInKelvin(percentage) {
  return getNumberInNestedRange(tempRanges, percentage);
}

// TODO: it appears this will no longer be needed. It's not been committed
//  before now, so it'll be committed as a comment, but should likely be
//  removed some time in the near future.
//
// function approximateTemperature(starClasses, subclass) {
//   let temperature = 0;
//   let addends = 0;
//   for (let i = 0, len = starClasses.length; i < len; i++) {
//     const starClass = starClasses[i];
//     const tempRange = type[starClass];
//     if (!tempRange) {
//       console.warn('=> No temperature info for', starClasses);
//       return null;
//     }
//     let limit = 9;
//     // TODO: if S-type etc, change limit.
//     temperature += subclassToKelvin(tempRange[0], tempRange[1], limit);
//     addends++;
//   }
//
//   if (addends <= 1) {
//     return temperature;
//   }
//   else {
//     return temperature / addends;
//   }
// }
//
// // Converts a subclass number (0-9) to degrees kelvin. The limit (9) can be
// // overridden as it's not the same for all types. For example, Y dwarfs are
// // classified 0-2 and S-types are classified 0-10.
// function subclassToKelvin(tempMin, tempMax=null, subclassNum, limit=9) {
//   if (tempMax === null) {
//     // Wolf-Rayet stars.
//     return tempMin;
//   }
//   // Take the inverse percentage of 0-9. Example, 2 will become 78% hot.
//   const inversePerc = Math.abs((subclassNum / limit) - 1);
//   console.log(`==> lerp(${tempMin}, ${tempMax}, ${inversePerc}) =`, lerp(tempMin, tempMax, inversePerc));
//   return lerp(tempMin, tempMax, inversePerc);
// }

export {
  estimateTemperatureInKelvin,
  specialRanges,
}
