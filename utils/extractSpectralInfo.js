// Assumes that star spectra may be missing the '+' required to separate into
// multi-stars. Note that this option is dangerous because it will return false
// positives for spectra containing lines such as 'kB9'. Might be useful for
// entries like kA3hA5mA5V (if I understand them correctly).
const attemptGuessingMissingPlus = false;

// All different types of stars.
const spectralClasses = [ 'O', 'B', 'A', 'F', 'G', 'K', 'M', 'S', 'W' ];

// 0-9 (0=hottest, 9=coldest). You may have fractions (eg.
// Mu Normae is O9.7 [that's an O, not a 0]).
const spectralSubclassMin = 0;
const spectralSubclassMax = 9;

// Luminosity class.
// 0 or Ia+	= Hypergiant or extremely luminous supergiant.
// Ia = Luminous supergiant.
// Iab = Intermediate-size luminous supergiant.
// c or Ib = Less luminous supergiant.
// II = Bright giant.
// g or III = Giant.
// sg or IV = Subgiant.
// d or V = Main sequence or dwarf.
// sd (prefix) or VI = Subdwarf.
// D (prefix) of VII = White dwarf.
//
// This script stores it as:
// 0=0/Ia+, 1=Ia, 2=Iab, 3=c/Ib, 4=II, 5=g/III, 6=sg/IV, 7=d/V, 8=sd/VI, 9=D/VII.
//
// A star might be classified as half way between other stars, indicated by:
//  / = star is *either* in the one class *or* the other.
//  - = star is *in between* two other classes.
// But wait, there's more!
// Remember that Ia+ above? Well turns out '+' can also mean binary (or triple,
// etc) star. Unless of course it's an Ia+ in which case the plus just means 0.
// Unless *unless* we're talking about an Ia+Ia in which case we actually *do*
// mean Ia (not Ia+) and a binary Ia partner. Except sometimes the star simply
// doesn't have a '+' at all and just blindly continues. Please help.
const possibleLuminosities = [
  '0', 'I', 'Ia+', 'Ia', 'Iab', 'c', 'Ib', 'II', 'g', 'III', 'IIIa',
  'IIIb', 'sg', 'IV', 'd', 'V', 'sd', 'VI', 'D', 'VII',
];

const isValid = {};

isValid.spectralClass = function(char) {
  return spectralClasses.includes(char) ||
    char === '/' ||
    char === '-';
};

isValid.spectralSubclass = function(char) {
  return (
    (char >= spectralSubclassMin && char <= spectralSubclassMax) ||
      char === '.' ||
      char === '/' ||
      char === '-'
  );
};

isValid.luminosityClass = function(char) {
  return (
    possibleLuminosities.includes(char)
  );
};

/**
 * Parses spectral information and returns easy to look up star information.
 * @param {string} spec
 */
function extractSpectralInformation(spec) {
  // O, B, A, F, G, K, M.
  let spectralClass = '';

  let spectralSubclass = '';

  let luminosityClass = '';
  const luminosityClasses = [];

  // Unknown unknowns.
  let peculiarities = '';

  let foundSpectralClass = false;
  let foundSubclass = false;
  let foundLuminosity = false;
  const specInfo = {};
  let discoveredClassifications = []; // for binaries, triples, etc.
  let buffer = '';
  // Used for ranges (eg. A1-F1).
  let to = [];
  // Used for either/or cases (eg. A1/F1).
  let or = [];
  // If this is '-' or '/' (used for spectral ranges), then 'to' or 'from' will
  // be used, respectively.
  let rangeType = '';

  // Flag used to indicate we've found a star with loose
  // definition, eg. A5-F1III/IVm
  let foundStarRange = false;

  /**
   * Saves star info processed thus as its own entity. This is useful in cases
   * where we have more than one star defined in spectral info.
   */
  function captureThisStar(target, rangeType='-') {
    if (!target) target = discoveredClassifications;
    // Record current info, then reset everything and move onto next star.
    const star = {
      spectralClass,
      spectralSubclass,
      luminosityClass,
      to,
      or,
    };
    if (!spectralClass) delete star.spectralClass;
    if (!spectralSubclass) delete star.spectralSubclass;
    if (!luminosityClass) delete star.luminosityClass;
    if (!to.length) delete star.to;
    if (!or.length) delete star.or;
    target.push(star);

    // Reset.
    spectralClass = '';
    foundSpectralClass = false;
    spectralSubclass = '';
    foundSubclass = false;
    luminosityClass = '';
    foundLuminosity = false;

    // console.log(`changing ${peculiarities} to ${peculiarities + buffer}`)
    peculiarities += buffer;

    buffer = '';
    rangeType = '';
    to = [];
    or = [];

    if (foundStarRange) {
      foundStarRange = false;
      const latest = target.pop();
      const parent = target.pop();
      let rangeKey;
      if (rangeType === '-') {
        rangeKey = 'to';
      }
      else {
        rangeKey = 'or';
      }
      if (latest.luminosityClass && !parent.luminosityClass) {
        parent.luminosityClass = latest.luminosityClass;
        delete latest.luminosityClass;
      }
      parent[rangeKey] = latest;
      target.push(parent);
    }
  }

  // This particular loop a bit easier to manage if we intentionally overflow by 1 and do appropriate checks.
  for (let i = 0, len = spec.length; i <= len; i++) {
    let char = '';
    let nextChar = '';

    // Prepare chars.
    if (i < len) {
      char = spec[i];
      if (i + 1 < len) {
        nextChar = spec[i + 1];
      }
    }

    // String processing starts here.

    // Special provisions for S type stars here. If S-type, don't even bother
    // with processing beyond star type (S-types used by this script don't need
    // more). Simply split by '/' and call it a day.
    if (spectralClass === 'S') {
      const xy = spec.split('/');
      return {
        spectralClass: 'S',
        x: xy[0],
        y: xy[1],
      };
    }

    // Special provisions for Wolf–Rayet stars here. Their naming is a tad
    // different, so some loop abuse happens here.
    if (spectralClass === 'W' && (char === 'N' || char === 'C')) {
      const nextNextChar = spec[i + 2];
      spectralClass += char;
      if (nextChar >= 0 && nextChar <= 9) {
        spectralClass += nextChar;
        i++;
        if (nextNextChar === 'h') {
          spectralClass += nextNextChar;
          i++;
        }
      }
      continue;
    }

    // A plus can have multiple meanings: next star, or scale. If the next
    // character is a star, then terminate and start anew. Else, append to last
    // built item as they likely mean '⁺' instead of '+'.
    if (char === '+') {
      const nextIsStar = spectralClasses.includes(nextChar);
      if (nextIsStar) {
        if (isValid.luminosityClass(buffer)) {
          luminosityClass = buffer;
          buffer = '';
        }
        captureThisStar();
        continue;
      }
      else {
        if (!foundSubclass && !foundLuminosity) {
          spectralSubclass += char;
          continue;
        }
        else if (foundLuminosity) {
          luminosityClass += char;
          continue;
        }
      }
    }
    //
    // Sort characters into appropriate variables.
    //
    buffer += char;
    //
    if (!foundSpectralClass) {
      // Look for spectral types.
      if (isValid.spectralClass(buffer)) {
        spectralClass += buffer;
        buffer = '';

        if (isValid.spectralClass(nextChar)) {
          // Not done yet. Continue recording.
        }
        else {
          foundSpectralClass = true;
        }
      }
      else {
        peculiarities += char;
        buffer = '';
      }
    }
    //
    else if (!foundSubclass) {
      // Look for subclasses.
      if (isValid.spectralSubclass(buffer)) {
        spectralSubclass += buffer;
        buffer = '';

        if (isValid.spectralSubclass(nextChar)) {
          // Not done yet. Continue recording.
        }
        else {
          if (isValid.spectralClass(nextChar) && (char === '-' || char === '/')) {
            // We're dealing something like A1-F1 or A1/F1.
            // Because we're in a range, the trailing range on the subclass is
            // invalid.
            spectralSubclass = spectralSubclass.slice(0, -1);

            captureThisStar(null, char);
            foundStarRange = true;
            // rangeType = char;
            // bookm
          }
          else {
            foundSubclass = true;
          }
        }
      }
      else {
        peculiarities += char;
        buffer = '';
      }
    }
    //
    else if (!foundLuminosity) {
      // Look for luminosities.
      if (nextChar === '-' || nextChar === '/') {
        if (isValid.luminosityClass(buffer)) {
          luminosityClass += buffer + nextChar;
        }
        else {
          peculiarities += buffer;
        }
        buffer = '';
        continue;
      }
      if (char === '-' || char === '/') {
        if (isValid.spectralClass(nextChar)) {
          // Found the star of a new star.
          luminosityClass += buffer;
          buffer = '';
          luminosityClass = luminosityClass.slice(0, -2);
          captureThisStar(null, char);
          foundStarRange = true;
        }
        buffer = '';
        continue;
      }

      if (isValid.luminosityClass(buffer)) {
        let nextIsMatch;
        if (!nextChar) {
          // We're at the end of the loop.
          nextIsMatch = false;
        }
        else {
          nextIsMatch = possibleLuminosities.includes(buffer + nextChar);
        }

        if (!nextIsMatch) {
          foundLuminosity = true;
          luminosityClass += buffer;
          buffer = '';
         }
      }
      else if (!isValid.luminosityClass(buffer) && !isValid.luminosityClass(buffer + nextChar)) {
        if (attemptGuessingMissingPlus) {
          if (isValid.spectralClass(nextChar) && nextChar !== '-' && nextChar !== '/') {
            // We're overflowing. This can happen with weirdly named spectra
            // missing plus delimiters, example kA3hA5mA5V.
            captureThisStar();
            continue;
          }
        }

        // This logic is flaky and will fail if we get ever get scenarious like
        // a class being called 'Z', another called 'ZZZ', but nothing called 'ZZ'.
        peculiarities += buffer;
        buffer = '';
      }
    }
    else if (attemptGuessingMissingPlus) {
      if (isValid.spectralClass(nextChar) && nextChar !== '-' && nextChar !== '/') {
        // We're overflowing. This can happen with weirdly named spectra
        // missing plus delimiters, example kA3hA5mA5V.
        captureThisStar();
      }
    }
  }

  captureThisStar();

  const primary = discoveredClassifications.shift();
  if (discoveredClassifications.length > 0) {
    primary.siblings = discoveredClassifications;
  }
  if (peculiarities) {
    primary.skipped = peculiarities;
  }

  return primary;
}

module.exports = extractSpectralInformation;
