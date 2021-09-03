// Creates a bunch of star data easily used in video games and visualisation
// contexts. Cross-references multiple catalogs.
//
// Saves alternate names in a separate file for easy querying later.
//
// The coordinate system is x,y,z ([tba] is up, [tba] is north) and the units are in
// parsecs.
//
// Expects [] from [] to be present, which can be downloaded here:
// https://github.com/aggregate1166877/BSC5P-JSON
//
// Requires Node.js > 10.
// Usage:
//  node buildRaDecJson.js

const fs = require('fs');
const BSC5P_JSON = require('./bsc5p_min.json');
const SIMBAD_CACHE_DIR = './simbad.u-strasbg.fr_cache';
const getStarName = require('./utils/getStarName');
const extractSpectralInformation = require('./utils/extractSpectralInfo');

const { appendData, changeIfNeeded, loopThroughData } = require('./amendmentFactory');
const { raToRadians, decToRadians, convertCoordsToRadians } = require('./utils/mathUtils');

// const RESULT_PRETTY_FILE = 'bsc5p_3d.json';
const RESULT_PRETTY_FILE = 'bsc5p_radec.json';
const RESULT_MIN_FILE = 'bsc5p_radec_min.json';
const RESULT_NAMES_PRETTY_FILE = 'bsc5p_names.json';
const RESULT_NAMES_MIN_FILE = 'bsc5p_names_min.json';

// Contains the processed catalog data.
let gameJson = [];
// Contains additional names for each star. Each star tends to contain a lot
// more bytes worth of names than all other star data combined, so we store
// extra names separately.
let extraNamesJson = [];

// ----------------------------------------------------------------------------

// Checks if the string starts with any of the specified strings. If it does,
// returns trimmed remainder of the string.
function getValue(line, outObject, stringArray) {
  for (let i = 0, len = stringArray.length; i < len; i++) {
    const lookup = stringArray[i];
    let prefix = '';

    for (let j = 0, len = line.length; j < len; j++) {
      const char = line[j];
      prefix += char;
      if (prefix === lookup) {
        return outObject[prefix] = line.substr(prefix.length).trim();
      }
    }
  }
  return null;
}

// Marks identifiers (extra names) section. This part is particularly
// annoying because space *might* delimit, or might not. It's generated for
// humans. Going with the assumption that 2 spaces = delimit. I'm happy to
// manually adjust any errors I find.
function addIdentifiers(line, outNames) {
  let foundSpace = false;
  let buffer = '';
  for (let i = 0, len = line.length; i < len; i++) {
    const char = line[i];
    if (char === ' ') {
      if (foundSpace) {
        if (buffer) {
          outNames.push(buffer.trim());
          buffer = '';
        }
      }
      else {
        foundSpace = true;
        buffer += char;
      }
      // else: Waiting to hit next column.
    }
    else {
      foundSpace = false;
      buffer += char;
    }
  }

  if (buffer) {
    outNames.push(buffer.trim());
  }
}

/**
 * Takes space delimited (i.e. '1 2 3') values and converts them to radians.
 * @param {string} coords - Space delimited right ascension followed by declination.
 * @returns {{declination: *, rightAscension: *}|{declination: null, rightAscension: null}}
 */
function spaceDelimCoordsToRadians(coords) {
  if (!coords) {
    return { rightAscension: null, declination: null };
  }

  // Splits the string when whitespace is encountered. This not create empty
  // values following 2 consecutive spaced.
  coords = coords.match(/\S+/g);

  const rightAscension = raToRadians(Number(coords[0]), Number(coords[1]), Number(coords[2]));

  let declination = decToRadians(Number(coords[3]), Number(coords[4]), Number(coords[5]));
  if (coords[3] === '-0' || coords[3] === '-00') {
    // Negatives are lost on 0.x declinations because it's presented as '-0'
    // first, which evaluates as '0' and loses the sign *before* its
    // fractions are added. Note that this rule does not apply to right
    // ascension as right ascension is never expressed in negative numbers.
    declination *= -1;
    // const before = declination;
    // console.log('[-1]', before, 'becomes:', declination);
  }

  return { rightAscension, declination };
}

function extractAsciiNamesParSpec(starName, dump) {
  // Separate each line into a separate item.
  const lines = dump.split('\n');
  // The extra key:value pairs we're extracting.
  const targetPairs = {};
  // The extra names we're extracting.
  const identifiers = [];

  // Internal flags.
  let skipNextLine = false;
  let foundIdentifiersSection = false;

  for (let i = 0, len = lines.length; i < len; i++) {
    // Skip this line if it was previously marked redundant.
    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }

    // Get the line, kill all whitespace.
    const line = lines[i].trim();

    // Once we reach the bibcodes section, we have all the info we need.
    if (line.substr(0,8) === 'Bibcodes') {
      break;
    }

    // Process identifiers.
    if (foundIdentifiersSection) {
      addIdentifiers(line, identifiers);
      continue;
    }

    // Skip empty lines.
    if (line.trim() === '') {
      continue;
    }

    // Skip own name and underline.
    if (line.substr(0, starName.length) === starName) {
      skipNextLine = true;
      continue;
    }

    // Skip lines starting with 'C.D.S.'.
    if (line.substr(0, 6) === 'C.D.S.') {
      continue;
    }

    // Skip object lines.
    if (line.substr(0, 7) === 'Object ') {
      continue;
    }

    // We've found the last section. Prep for it.
    if (line.substr(0, 11) === 'Identifiers') {
      foundIdentifiersSection = true;
      continue;
    }

    getValue(line, targetPairs, [
      'Coordinates(ICRS,ep=J2000,eq=2000):',
      'Parallax:', // divide by 1000.
      'Spectral type:',
    ]);
  }

  let coords = targetPairs['Coordinates(ICRS,ep=J2000,eq=2000):'];
  const { rightAscension, declination } = spaceDelimCoordsToRadians(coords);

  let parallax = targetPairs['Parallax:'];
  if (parallax) {
    // Grab the first value.
    parallax = parallax.split(' ')[0];
    // Divide it by 1000.
    parallax /= 1000;
  }

  let spectralType = targetPairs['Spectral type:'];
  if (spectralType) {
    spectralType = spectralType.split(' ')[0];
  }

  return {
    rightAscension,
    declination,
    parallax,
    spectralType,
    namesAlt: identifiers,
  };
}

function processEntry(entry, isCustomEntry) {
  const starName = getStarName(entry);
  if (!starName) {
    // This happens especially often with novas.
    console.error('xx Error: Celestial body has missing name:', entry);
    return;
  }

  const fileName = `./${SIMBAD_CACHE_DIR}/${encodeURI(starName)}.txt`;

  let lineId, rightAscension, declination, parallax, visualMagnitude, spectralType, namesAlt = [];

  // TODO: continue from here. Custom not being hit.
  if (isCustomEntry) {
    const coords = spaceDelimCoordsToRadians(
      `${entry.ra} ${entry.dec}`,
    );
    lineId = entry.lineNumber;
    rightAscension = coords.rightAscension;
    declination = coords.declination;
    parallax = entry.parallax;
    visualMagnitude = entry.visualMagnitude;
    spectralType = entry.spectralType;
    namesAlt = entry.additionalNames;
  }
  else {
    // Get data from cached page.
    const simPage = fs.readFileSync(fileName, 'utf8');
    const data = extractAsciiNamesParSpec(starName, simPage);

    lineId = Number(entry.lineNumber);
    rightAscension = data.rightAscension;
    declination = data.declination;
    parallax = data.parallax;
    visualMagnitude = Number(entry.visualMagnitude);
    spectralType = data.spectralType;
    namesAlt = data.namesAlt;
  }

  if (rightAscension < 0) {
    // Hasn't happened thus far, but hey it's an easy check.
    console.error('xx Error: Found star with negative right ascension. This is invalid.');
    return;
  }

  // Check for overrides.
  const positions = changeIfNeeded.raDec(lineId, { rightAscension, declination });
  rightAscension = positions.rightAscension;
  declination = positions.declination;

  if (entry.customAdditionalNames) {
    // customAdditionalNames is used by the 'addCustomStars' amendment script
    // and is not included in original BSC5P data.
    namesAlt.push(...entry.customAdditionalNames);
  }

  gameJson.push({
    i: lineId,
    n: changeIfNeeded.defaultName(lineId, starName, namesAlt),
    r: rightAscension,
    d: declination,
    p: changeIfNeeded.parallax(lineId, parallax),
    b: visualMagnitude,
    s: spectralType,
  });

  extraNamesJson.push({
    i: lineId,
    // Adds additional names not originally in the star catalogs, if needed.
    n: appendData.addNames(lineId, namesAlt),
  });
}

function processAllEntries() {
  let lineCount = 0;
  // appendData.addCustomStars(BSC5P_JSON);
  for (let i = 0, len = BSC5P_JSON.length; i < len; i++) {
    // Log progress every 1000 lines.
    if (++lineCount % 1000 === 0) {
      console.log('   ... reached entry', lineCount);
    }
    const entry = BSC5P_JSON[i];
    processEntry(entry);
  }

  console.log('=> Adding amended star entries (if any)');
  loopThroughData.customStars((entry) => {
    if (++lineCount % 1000 === 0) {
      console.log('   ... reached entry', lineCount);
    }
    processEntry(entry, true);
  });
}

// ----------------------------------------------------------------------------

processAllEntries();

console.log(`=> Data compiled; saving files:`);

console.log('   ...', RESULT_PRETTY_FILE);
fs.writeFileSync(RESULT_PRETTY_FILE, JSON.stringify(gameJson, null, 4));

console.log('   ...', RESULT_MIN_FILE);
fs.writeFileSync(RESULT_MIN_FILE, JSON.stringify(gameJson));

console.log('   ...', RESULT_NAMES_PRETTY_FILE);
fs.writeFileSync(RESULT_NAMES_PRETTY_FILE, JSON.stringify(extraNamesJson, null, 4));

console.log('   ...', RESULT_NAMES_MIN_FILE);
fs.writeFileSync(RESULT_NAMES_MIN_FILE, JSON.stringify(extraNamesJson));
