// Adds parallax, additional spectral information, and additional names to data
// contained in bsc5p_min.json, and then saves the changes as bsc5p_extra json
// files. It relies on cacheSimbadStarData.js already having saved queried data
// from https://simbad.u-strasbg.fr to ./simbad.u-strasbg.fr_cache
//
// Note this this will likely need adjustment as I've noticed issues with NGC
// cluster parallaxes.
//
// Requires Node.js > 10.
// Usage:
//  node crossRefSimbadData.js

const fs = require('fs');
const BSC5P_JSON = require('./bsc5p_min.json');
const SIMBAD_CACHE_DIR = './simbad.u-strasbg.fr_cache';
const getStarName = require('./utils/getStarName');

const RESULT_PRETTY_FILE = 'bsc5p_extra.json';
const RESULT_MIN_FILE = 'bsc5p_extra_min.json';

// Example API result:
//
// const hd1064 = `
// C.D.S.  -  SIMBAD4 rel 1.7  -  2021.08.23CEST11:42:16
//
// HD1064
// ------
//
// Object HD 1064  ---  *  ---  OID=@1328042   (@@27341,6)  ---  coobox=10569
//
// Coordinates(ICRS,ep=J2000,eq=2000): 00 14 54.5165232598  -09 34 10.429900451 (Opt ) A [0.0976 0.0522 90] 2018yCat.1345....0G
// Coordinates(FK4,ep=B1950,eq=1950): 00 12 21.3529675657  -09 50 50.610292805
// Coordinates(Gal,ep=J2000,eq=2000): 095.0634522807582  -70.4387829953753
// hierarchy counts: #parents=1, #children=0, #siblings=0
// Proper motions: 23.85 -7.73 [0.48 0.20 0] A 2007A&A...474..653V
// Parallax: 9.0508 [0.1113] A 2018yCat.1345....0G
// Radial Velocity: 19.90 [0.8] A 2006AstL...32..759G
// Redshift: 0.000066 [0.000003] A 2006AstL...32..759G
// cz: 19.90 [0.80] A 2006AstL...32..759G
// Flux B : 5.670 [0.014] D 2000A&A...355L..27H
// Flux V : 5.749 [0.009] D 2000A&A...355L..27H
// Flux G : 5.7471 [0.0007] C 2018yCat.1345....0G
// Flux J : 5.930 [0.026] C 2003yCat.2246....0C
// Flux H : 5.972 [0.038] C 2003yCat.2246....0C
// Flux K : 5.941 [0.018] C 2003yCat.2246....0C
// Spectral type: B8.5V C 1970MmRAS..72..233H
// Morphological type: ~ ~ ~
// Angular size:     ~     ~   ~ (~)  ~ ~
//
// Identifiers (24):
//    TIC 408013666                   2MASS J00145452-0934104         GC 283
//    BD-10 30                        GCRV 50192                      GEN# +1.00001064
//    GSC 05261-00524                 HD 1064                         HIC 1191
//    HIP 1191                        HR 51                           PHL 2774
//    PPM 182020                      SAO 128660                      SKY# 440
//    SRS 3012                        TD1 98                          TYC 5261-524-1
//    UBV 158                         UBV M 7243                      YZ 99 36
//    uvby98 100001064                WEB 213                         Gaia DR2 2428341184508675456
//
// Bibcodes  1850-2021 () (57):
//   2019A&A...623A..72K  2019AJ....158...77C  2019MNRAS.483..299G  2019MNRAS.486.1260Z
//   2019MNRAS.488.3089K  2019MNRAS.490.3158C  2017AJ....153...16S  2016A&A...591A.118S
//   2016AJ....151....3G  2016AJ....152...40G  2015A&A...580A..23P  2015MNRAS.449.3651M
//   2014A&A...565A.117C  2013PASP..125.1191L  2012A&A...537A.120Z  2012A&A...546A..61D
//   2012ApJS..199....8G  2012AstL...38..694G  2012MNRAS.424.1925C  2012MNRAS.427..343M
//   2010A&A...510A..54W  2010ApJ...722..605H  2008MNRAS.389..869E  2007A&A...463..671R
//   2007ApJ...661..944R  2006AstL...32..759G  2002A&A...381..105R  2002A&A...393..897R
//   2002ApJ...573..359A  2002MNRAS.331...45K  2001A&A...367..521P  1999A&AS..135..503G
//   1999A&AS..137..451G  1999MSS...C05....0H  1998A&AS..129..431H  1998A&AS..130..455V
//   1996A&AS..118..481B  1995A&AS..114..269D  1993yCat.3135....0C  1986A&AS...64..261D
//   1985A&AS...60...99W  1983A&A...122...23A  1983A&AS...53..445Z  1980A&AS...40..207C
//   1980MNRAS.191..651K  1977A&AS...27..443G  1977PASP...89..187E  1976A&AS...23..125S
//   1974ApJ...194...65W  1973AJ.....78..738C  1970MmRAS..72..233H  1968ApJ...151..907A
//   1967PASP...79..102A  1962BOTT....3...37H  1956ApJ...123..440S  1952AnAp...15..113B
//   1950ZA.....27..182G
//
// Measures (distance:1  Fe_H:3  MK:5  PLX:3  PM:4  ROT:4  velocities:6  ):
// distance:1Fe_H:3MK:5PLX:3PM:4ROT:4velocities:6
//
// Notes (0) :
//
// ================================================================================
//
// `;

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

    // Skip coords lines.
    if (line.substr(0, 11) === 'Coordinates') {
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
      'Parallax:', 'Spectral type:',
    ]);
  }

  const par = targetPairs['Parallax:'];
  const spec = targetPairs['Spectral type:'];

  return {
    parallaxAlt: par ? par.split(' ') : null,
    spectralAlt: spec ? spec.split(' ') : null,
    namesAlt: identifiers,
  }
}

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

  const { parallaxAlt, spectralAlt, namesAlt } = extractAsciiNamesParSpec(starName, simPage);
  entry.parallaxAlt = parallaxAlt;
  entry.spectralAlt = spectralAlt;
  entry.namesAlt = namesAlt;
}

console.log(`=> Extras added; saving files:`);

console.log('   ...', RESULT_PRETTY_FILE);
fs.writeFileSync(RESULT_PRETTY_FILE, JSON.stringify(BSC5P_JSON, null, 4));

console.log('   ...', RESULT_MIN_FILE);
fs.writeFileSync(RESULT_MIN_FILE, JSON.stringify(BSC5P_JSON));
