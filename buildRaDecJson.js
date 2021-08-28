// Creates a bunch of star data easily used in video games and visualisation
// contexts. Cross-references multiple catalogs.
//
// Saves alternate names in a separate file for easy querying later.
//
// The coordinate system is x,y,z ([] is up, [] is north) and the units are in
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

// const RESULT_PRETTY_FILE = 'bsc5p_3d.json';
const RESULT_PRETTY_FILE = 'bsc5p_radec.json';
const RESULT_MIN_FILE = 'bsc5p_radec_min.json';
const RESULT_NAMES_PRETTY_FILE = 'bsc5p_radec_names.json';
const RESULT_NAMES_MIN_FILE = 'bsc5p_radec_names_min.json';

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
    ]);
  }

  let coords = targetPairs['Coordinates(ICRS,ep=J2000,eq=2000):'];
  let rightAscension = null;
  let declination = null;

  if (coords) {
    coords = coords.split(' ');
    rightAscension = [
      // hours,  minutes,   seconds
      Number(coords[0]), Number(coords[1]), Number(coords[2]),
    ];
    declination = [
      // degrees, minutes,  seconds
      Number(coords[4]), Number(coords[5]), Number(coords[6]),
    ];
  }

  let parallax = targetPairs['Parallax:'];
  if (parallax) {
    // Grab the first value.
    parallax = parallax.split(' ')[0];
    // Divide it by 1000.
    parallax /= 1000;
  }

  return {
    rightAscension,
    declination,
    parallax,
    namesAlt: identifiers,
  }
}

let gameJson = [];
let extraNamesJson = [];
let lineCount = 0;
for (let i = 0, len = BSC5P_JSON.length; i < len; i++) {
  // Log progress every 1000 lines.
  if (++lineCount % 1000 === 0) {
    console.log('   ... reached line', lineCount);
  }

  const entry = BSC5P_JSON[i];
  const starName = getStarName(entry);
  if (!starName) {
    // More a formality, all were tested and have names.
    console.error('=> Celestial body has missing name:', entry);
    continue;
  }

  const fileName = `./${SIMBAD_CACHE_DIR}/${encodeURI(starName)}.txt`;
  const simPage = fs.readFileSync(fileName, 'utf8');

  const { rightAscension, declination, parallax, namesAlt } =
    extractAsciiNamesParSpec(starName, simPage);

  // TODO: if we have an alt name child with '^NAME ', then it's the popular name and
  //  should be prioritised. For example, by default Betelgeuse will be named
  //  HD39801 which is not ideal.
  gameJson.push({
    i: Number(entry.lineNumber),
    n: starName,
    r: rightAscension,
    d: declination,
    p: parallax,
    b: Number(entry.visualMagnitude),
    s: entry.spectralType,
  });

  // TODO: add custom amendments:
  // Alnitak A -> 1948, or '* zet Ori A'
  // Alnitak B -> 1949, or '* zet Ori B' (and AB also exists, but is not part of the BSC).
  // --
  // Meissa A -> 1879, or '* lam Ori A'
  // Meissa B -> 1880, or '* lam Ori B'

  extraNamesJson.push({
    i: entry.lineNumber,
    n: namesAlt,
  });
}

console.log(`=> Data compiled; saving files:`);

console.log('   ...', RESULT_PRETTY_FILE);
fs.writeFileSync(RESULT_PRETTY_FILE, JSON.stringify(gameJson, null, 4));

console.log('   ...', RESULT_MIN_FILE);
fs.writeFileSync(RESULT_MIN_FILE, JSON.stringify(gameJson));

console.log('   ...', RESULT_NAMES_PRETTY_FILE);
fs.writeFileSync(RESULT_NAMES_PRETTY_FILE, JSON.stringify(extraNamesJson, null, 4));

console.log('   ...', RESULT_NAMES_MIN_FILE);
fs.writeFileSync(RESULT_NAMES_MIN_FILE, JSON.stringify(extraNamesJson));
