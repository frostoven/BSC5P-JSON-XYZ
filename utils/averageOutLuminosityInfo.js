// Note on lumClasses here - synonyms were made on a best-effort bases by
// comparing a lot of inconsistent literature. It's possible I got some of
// these wrong, let me know if I have a bad classification on one of the
// synonyms.
let it = -1;
// TODO: revise this. Turns out meanings are not exactly intuitive. Glaring
//  example I discovered after making the parser:
//   * III is a giant.
//   * III+ is a slightly more luminous giant.
//   * IIIa is slightly brighter than III.
//   * IIIb is slightly *dimmer* than III (in other words, it's not incremental).
//  All these edge cases need to be taken into account before we can run a blanket conversion.
const lumClasses = {
  '0': ++it,
  Ia: it, // no incrementing here because it's a synonym of 0.
  I: ++it,
  'Ia+': ++it,
  Iab: ++it,
  c: it, // synonym of Iab.
  Ib: ++it,
  II: ++it,
  g: it, // synonym of II.
  III: ++it,
  IIIa: ++it,
  IIIb: ++it,
  IV: ++it,
  sg: it, // synonym of IV.
  V: ++it,
  d: it, // these still fall under main sequence.
  VI: ++it,
  sd: it, // synonym of VI.
  VII: ++it,
  D: it, // synonym of VII.
  length: ++it, // used for calculating percentages.
};

// Converts Roman numerals to regular numbers from 1-10. Note that this might
// not do what you expect - a III won't become 3, for example, but rather 6.
// This is because it attempts to output numbers corresponding to luminosities
// along a total range of 0-100%. Returns null if parsing fails.
function parseRomanLuminosity(string) {
  console.error(
    '*** Avoid using parseRomanLuminosity for now - it has a ton of edge ' +
    'cases not yet accounted for. ***'
    // ^^ See the todo listed above 'const lumClasses'.
  );

  // All possible luminosity classes for this star. Your initial intuition
  // might be that there should be only one, but values like 'III-IV' and
  // 'III/IV' exist.
  let lums;
  if (string.includes('-')) {
    lums = string.split('-');
  }
  else if (string.includes('/')) {
    lums = string.split('-');
  }
  else {
    lums = [ string ];
  }

  // Used to indicate additional luminosity, example III⁺ (not to be confused
  // with III+).
  // const extraLum = new Array(lums.length).fill(false);

  // Loop though all luminosity and determine 1) if we have classifications for
  // them and  2) if they have extra luminosity. Calculate the average of
  // discovered values.
  let sum = 0;
  let divisor = 0;
  for (let i = 0, len = lums.length; i < len; i++) {
    let lum = lums[i];
    let extraLum = false;

    // Note: a '+' can be part of the classification (eg. Ia+) or it can mean
    // more luminosity (eg. III+). This means we need to guess the meaning.
    const itemExist = !isNaN(lumClasses[lum]);
    if (!itemExist && string.includes('+')) {
      const testLower = lum.split('+')[0];
      const testExists = !!lumClasses[lum];
      if (testExists) {
        extraLum = true;
        lum = testExists;
      }
      else {
        // Unknown classification.
        console.warn(`-> Could not figure out what the '${lum}' part int luminosity '${string}' means.`);
        continue;
      }
    }
    else if (!itemExist) {
      // Unknown classification.
      console.warn(`-> Could not figure out what the '${lum}' part int luminosity '${string}' means.`);
      continue;
    }

    // Prep number for averaging.
    let number = lumClasses[lum];
    // 'More luminosity' means going closer to zero (I think?), so subtract if
    // more luminous.
    extraLum ? number -= 0.5 : 0;
    sum += number;
    divisor++;
  }

  if (divisor === 0) {
    console.warn(`=> Could not figure out what luminosity '${string}' means.`);
    return null;
  }

  // Return average.
  return sum / divisor;
}
