import BLACKBODY from '../catalogs/blackbody.json' assert { type: "json" };
import { hsl } from 'd3-color';
import { hsv } from 'd3-hsv';
import { piecewise, interpolateHsl, interpolateRgb } from 'd3-interpolate';
import { estimateTemperatureInKelvin } from './hrDiagram';
import { kelvinToRGB } from './mathUtils';

const colorSteps = 150;
const glowColors = [ 'blue', 'white', 'yellow', 'orange', 'red', 'purple' ];

// Used to shorten keys in JSON while still using human-readable names in code.
const key = {
  color: 'c',
  glow: 'g',
  // If the star has a range, or uncertainty, a colour averaged between those
  // values is created and stored here.
  rangedGlow: 'v', // TODO: remove me.
  // If the star has siblings, its siblings merged into one colour and stored
  // here.
  averagedMulti: 'h',
  multiStar: 'm',
  blackbodyColor: 'K',
};

let it = 0;
// Approximation of logarithmic colour distribution. The reason for an
// approximation is that every reference I've seen looks completely different,
// leading me to believe there is no 'precise' accepted colour distribution
// (which makes sense given that every class is technically a range of varying
// spectrum length). I'm happy to change this implementation if someone can
// find a source that says otherwise.
// Note that these items are not strictly incremented and are adjusted ad-hoc.
const starClass = {
  O: it++,
  W: it, // We treat this like a synonym of O because they're similar.
  B: it++,
  // ---------------------------------------------------------------
  // White dwarfs range anywhere from 8k-40k, so can be like A,B,O. We'll
  // approximate to B0 (8.7k).
  D: it,
  DA: it,
  DB: it,
  DO: it,
  DZ: it,
  // ---------------------------------------------------------------
  A: it++,
  F: it++,
  G: it++,
  K: it++,
  M: it++,
  S: it, // Similar to M.
  L: it++,
  T: it++,
  Y: it++,
  length: it,
};

// Splits a string using '/' or '-', whichever it has.
function getSplitRange(string) {
  let parts;
  if (string.includes('/')) {
    parts = string.split('/');
  }
  else if (string.includes('-')) {
    parts = string.split('-');
  }
  else {
    parts = [ string ];
  }
  return parts;
}

function averageSpecClass(string, starName) {
  let parts = getSplitRange(string);
  let sum = 0;
  let divisor = 0;
  // let errors = 0;

  // Loop through all numbers and average out discovered values.
  const numbers = [];
  for (let i = 0, len = parts.length; i < len; i++) {
    const item = starClass[parts[i]];
    if (isNaN(item)) {
      console.warn(`[${starName}] -> Found non-number '${item}' in number class:`, string);
      continue;
    }
    if (item === '') {
      continue;
    }

    sum += Number(item);
    divisor++;
  }

  if (divisor === 0) {
    return null;
  }

  return sum / divisor;
}

// Averages strings like `2-4` (becomes 3).
// Splits a delimited string and returns the result. Automatically figures out
// the delimiter (supports -/).
// Returns 4.5 if an empty string is given (because it's a reasonable
// midpoint), returns null if a number could not be determined.
function averageNumberRange(string, starName) {
  if (string === '') {
    return 4.5;
  }

  let parts = getSplitRange(string);
  let sum = 0;
  let divisor = 0;

  // Loop through all numbers and average out discovered values.
  const numbers = [];
  for (let i = 0, len = parts.length; i < len; i++) {
    const item = parts[i];
    if (isNaN(item)) {
      console.warn(`[${starName}] -> Found non-number '${item}' in number string:`, string);
      continue;
    }
    if (item === '') {
      continue;
    }

    sum += Number(item);
    divisor++;
  }

  if (divisor === 0) {
    return null;
  }

  return sum / divisor;
}

/**
 * Takes the star class, and returns a percentage of where it falls within the
 * colour spectrum.
 * @param {string} specValue
 * @returns {number}
 */
function getClassPerc(specValue) {
  const cls = specValue / starClass.length;
  return cls * colorSteps;
}

/**
 * Takes the star class, and returns a percentage of where it falls within the
 * colour spectrum. Note that the range is calculated based on the amount of
 * colour steps; as in the, the percentage returned is a percentage of the
 * colour step value.
 * @param {number} subclass
 * @param {number} [limit] - The limit (9) can be overridden as it's not the
 *   same for all types. For example, Y dwarfs are classified 0-2 and S-types
 *   are classified 0-10.
 * @returns {number}
 */
function getSubclassPerc(subclass, limit=9) {
  // We pick 'B' because it's the second item in the starClass list. If
  // anything else ever becomes the second item, this will need to be updated.
  const unitLength = (starClass.B / starClass.length) * colorSteps;
  const factor = subclass / limit;
  return unitLength * factor;
}

const genColor = (percentage) => {
  const colorFn = piecewise(interpolateHsl, glowColors);
  const transformedHsl = hsl(colorFn(percentage)).brighter(1.5);
  // hsl.s -= 0.5;
  return transformedHsl.formatHex();
}

const genGlow = (percentage) => {
  const colorFn = piecewise(interpolateHsl, glowColors);
  const transformedHsl = hsl(colorFn(percentage));
  return transformedHsl.formatHex();
}

// Takes two colors, and averages them out. Because we know we're dealing with
// stars, this will preserve the max [HSV] value because a true average can
// actually dim a colour. We do don't want dimming, because they add to one
// another's brightness.
function getAveragedColor(colorOne, colorTwo) {
  const colorFn = piecewise(interpolateRgb, [ colorOne, colorTwo ]);
  // Get highest hsValue among the two colours for use later.
  const maxValue = Math.max(hsv(colorOne).v, hsv(colorTwo).v);
  // Average the two colours.
  const transformedHsl = hsv(colorFn(0.5));
  // Restore previous max brightness.
  transformedHsl.v = maxValue;
  // Return as hex.
  return transformedHsl.formatHex();
}

/**
 * Calculates the colour and glow of a star as seen from a far-away distance.
 * @param {string|array} specClass - Spectral class (eg. O to Y). If an array
 *          is provided, averages out the colour between them, and returns that
 *          average in addition to the individual colours.
 * @param {string|array} specSubclass - Spectral subclass (eg. 0-9). If an array
 *          is provided, averages out the colour between them, and returns that
 *          average in addition to the individual colours.
 * @param [starName] - Used for debugging.
 * @returns {{color: *, glow: *}}
 */
function getStarColor(specClass, specSubclass, starName) {
  // console.log('getStarColor:', averageSpecClass(specClass), averageNumberRange(specSubclass));
  // console.log('spec info:', { specClass }, { specSubclass });

  const avgSpecClass = averageSpecClass(specClass, starName);
  const avgNumRange = averageNumberRange(specSubclass, starName);
  const classPerc = getClassPerc(avgSpecClass);
  const subClassPerc = getSubclassPerc(avgNumRange);

  let stepValue = classPerc + subClassPerc;
  const percentage = stepValue / colorSteps;

  const temperature = estimateTemperatureInKelvin(percentage);
  // console.log(`=> [${starName}]`, { specClass, classPerc }, '+', { specSubclass, subClassPerc }, {temperature} ,'\n');
  const blackbodyColor = kelvinToRGB(temperature, BLACKBODY);
  // TODO: implement mechanism to correctly handle Wolf-Rayet, S-type, and other special
  //  kinds of stars.

  // TODO: check what kind of temperature we get for D classes. We're expecting
  //  8k-40k, which most lower rather than higher. Note: lowest known is only
  //  4k; this is not an incorrect classification.

  const color = genColor(percentage);
  const glow = genGlow(percentage);
  return { color, glow, blackbodyColor };
}

/**
 * Calculates the colours of the star (or multi-star) as seen from a distance,
 * and calculates the colour as seen from a short distance.
 * @param spectralInfo - Data as returned by extractSpectralInformation().
 * @param {string} spectralInfo.spectralClass - O B A F G K M D S W, etc.
 * @param {string} spectralInfo.spectralSubclass - 0-9 (usually).
 * @param {object|null} spectralInfo.to - Possible classification is in a range.
 * @param {object|null} spectralInfo.or - Star might be this classification instead.
 * @param {Array} spectralInfo.siblings - Each sibling follows the same structure as spectralInfo.
 * @param [starName] - Used for debugging.
 * @param {boolean} [isNested] - Used internally to determine if siblings are being checked.
 */
function getStarColors(spectralInfo, starName, isNested=false) {
  // We need to return the color and glow for this (multi)star. Note that a
  // multi-star system has a *single* color (i.e. they're a single dot) in the
  // sky when you're a large distance away. That single dot of colour/glow is
  // is stored in the root.
  // Each sibling then has its own color/glow calculated too, which the
  // visualisation software will display if the star is very close to the
  // camera (eg. 5 AU).
  // We make keys short to keep the resulting file small. Keys are stored in
  // the 'key' object.
  // const result = {};
  const palette = { [key.rangedGlow]: null };

  // Calculate root colour.
  const { spectralClass, spectralSubclass = '0' } = spectralInfo;
  if (spectralClass) {
    const star = getStarColor(spectralClass, spectralSubclass, starName);
    palette[key.color] = star.color;
    palette[key.glow] = star.glow;
    palette[key.blackbodyColor] = star.blackbodyColor;
  }

  // Calculate range colour, and average out with root colour if found.
  const { to, or } = spectralInfo;
  let range;
  if (to) range = to;
  else if (or) range = or; // you can have either, but not both.
  if (range) {
    const { spectralClass, spectralSubclass = '0' } = range;
    if (spectralClass) {
      const sub = getStarColor(spectralClass, spectralSubclass, starName);
      const avgGlow = getAveragedColor(palette[key.glow], sub.glow);
      palette[key.rangedGlow] = avgGlow;
    }
  }

  // If we've not had more than one color to create an average, just use the
  // only colour we have as the average. Makes deep colour averaging a bit
  // easier.
  if (!palette[key.rangedGlow]) {
    palette[key.rangedGlow] = palette[key.glow];
  }

  // Loop into sibling data.
  const siblings = spectralInfo.siblings;
  const siblingData = [];
  if (siblings && siblings.length) {
    for (let i = 0, len = siblings.length; i < len; i++) {
      const siblingInfo = siblings[i];
      siblingData.push(getStarColors(siblingInfo, starName, true));
    }
  }
  palette[key.multiStar] = siblingData;

  // If we have multiple colour sources, combine them all into a single colour.
  // if (palette[key.rangedGlow])
  if (siblingData.length && !isNested) {
    palette[key.averagedMulti] = deepMergeColour(palette);
  }

  return palette;
}

// Iterates through a spectral object, averaging all colours it finds.
function deepMergeColour(paletteInfo) {
  // let colour = spectralInfo[k.]
  let runningColor = paletteInfo[key.rangedGlow];

  const siblings = paletteInfo[key.multiStar];
  for (let i = 0, len = siblings.length; i < len; i++) {
    const star = siblings[i];
    if (!runningColor) {
      runningColor = star[key.rangedGlow];
    }
    else {
      runningColor = getAveragedColor(runningColor, star[key.rangedGlow]);
    }
  }

  return runningColor;
}

// Removes colours deemed unnecessary duplicates. This includes ranged glow
// that matches base glow, and averaged multi that matches base glow. Also
// removes empty siblings.
function removeRedundantColorInfo(palette) {
  // Stars with uncertain colours.
  if (palette[key.rangedGlow] === palette[key.glow]) {
    delete palette[key.rangedGlow];
  }
  // Stars that have siblings.
  if (palette[key.averagedMulti] === palette[key.glow]) {
    delete palette[key.averagedMulti];
  }
  // Delete siblings if the sibling object is empty.
  if (palette[key.multiStar] && palette[key.multiStar].length === 0) {
    delete palette[key.multiStar];
  }
  // If we have siblings, loop into them and do the same check.
  if (palette[key.multiStar] && palette[key.multiStar].length) {
    const siblings = palette[key.multiStar];
    for (let i = 0, len = siblings.length; i < len; i++) {
      const sibling = siblings[i];
      siblings[i] = removeRedundantColorInfo(sibling);
    }
  }
  return palette;
}

export {
  key,
  getStarColors,
  removeRedundantColorInfo,
}
