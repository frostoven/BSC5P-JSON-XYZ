// Note: do not use this to create new stars - only use this to modify existing
// stars. Use loopThroughCustomStars for new stars.
//
// Each entry is identified by a line ID, which has a block of information.
// That block contains overrides, and additions. Overrides will replace
// information from the source with values you specify. Additions on the other
// hand add new information to existing information without replacing anything.
// Note that you should only add fields for values you actually want amended.
// For example, if you want to change the parallax of the star but not the
// brightness, then you should not enter the brightness at all (unless you feel
// you have a valid reason to).
//
// Another thing to note is sibling overrides: while supported, they exist more
// for compatibility with older catalogs. If you're entering data for a star
// with siblings, instead of adding sibling information, consider setting the
// siblingInfo field to [] and instead creating a new star.
//
// Note that, if amending x,y,z coordinates, you have to specify all 3 of them.
// Specifying only 1 or 2 of them will result in the amendment being ignored.
const amendmentData = {
  /* Example:
  ******************************************
  lineId: {
    // Write your reason for adding the override (this is required).
    // Please also cite your source so that the submission may be peer-reviewed.
    overrides: {
      primaryName: 'Test star',
      ra: '2 13 45',
      dec: '-0 1 9.9',
      x: 206265, y: -828000, z: 3.26,
      visualMagnitude: 0.1,
      parallax: 0.03,
      spectralType: 'A1Vn',
      luminosity: 832000,
      naiveLuminosity: 58512, // Use only if you want to affect end-user visualisation.
      cartoonColor: '#ffffff', // Specify any colour that looks more-or-less correct.
      blackbodyColor: {
        // Blackbody color needs to be accurate. If you're unsure how to determine this,
        // rather leave it blank.
        r: 0.386,
        g: 0.526,
        b: 1,
      },
      siblingInfo: {
        // See README for possible values. They're all single character field names.
      },
      specExtra: {
        // Extra spectral info. See README for possible values. They're all
        // single character field names.
      },
    },
    additions: {
      namesAlt: [ 'Any additional names', 'you wish', 'to add' ],
    },
    // Fallback is used to identify the star in future if for whatever reason
    // IDs get messed up. This is a required field, try get at least 3 other
    // known names (although a single name is fine if it really has no other
    // names).
    fallback: [ 'Exising', 'known', 'names' ],
  },
  ******************************************
  */
  1879: {
    overrides: {
      // Default is HD36861, which is not ideal. Use popular name instead.
      // Source: https://en.wikipedia.org/wiki/Meissa
      primaryName: 'Meissa A',
    },
    fallback: [ '* 39 Ori A', 'CEL 811', 'Gaia DR2 3337991583942617088' ],
  },
  1880: {
    overrides: {
      // Default is HD36862, which is not ideal. Use popular name instead.
      // Source: https://en.wikipedia.org/wiki/Meissa
      primaryName: 'Meissa B',
    },
    fallback: [ '* 39 Ori B', 'BD+09 879B', 'Gaia DR2 3337991583942616704' ],
  },
  1948: {
    overrides: {
      // Default is HD37742, which is not ideal. Use popular name instead.
      // Source: https://en.wikipedia.org/wiki/Alnitak
      primaryName: 'Alnitak A',
      // Original datasource does not have this data.
      // Source: https://en.wikipedia.org/wiki/Alnitak
      parallax: 0.00443,
    },
    fallback: [ '* zet Ori A', 'GCRV 3517', 'ADS 4263 A' ],
  },
  1949: {
    overrides: {
      // Default is HD37743, which is not ideal. Use popular name instead.
      // Source: https://en.wikipedia.org/wiki/Alnitak
      primaryName: 'Alnitak B',
      // Original datasource does not have this data.
      // Source: https://en.wikipedia.org/wiki/Alnitak
      parallax: 0.00443,
    },
    fallback: [ '* 50 Ori B', 'GCRV 3518', 'ADS 4263 B' ],
  },
};

// -- ✄ Cut here ------------------------------------------------ //

const validOverrides = [
  'primaryName', 'ra', 'dec', 'visualMagnitude', 'parallax', 'spectralType',
  'luminosity', 'naiveLuminosity', 'cartoonColor', 'blackbodyColor',
  'siblingInfo', 'specExtra',
];

const validAdditions = [
  'namesAlt',
];

export default function amendAsNeeded(outObject) {
  // Note: due to being originally based on the BSC5P, ID starts at 1, not 0.
  const amendment = amendmentData[outObject.lineId];
  if (amendment) {
    const { overrides, additions } = amendment;

    // Process overrides.
    if (overrides) {
      for (const overrideKey of validOverrides) {
        const override = overrides[overrideKey];
        if (typeof override !== 'undefined') {
          outObject[overrideKey] = override;
        }
      }
    }

    if (additions) {
      // Process additions.
      for (const additionKey of validAdditions) {
        const addition = additions[additionKey];
        if (typeof addition !== 'undefined') {
          if (!Array.isArray(outObject[additionKey])) {
            outObject[additionKey] = [];
          }
          outObject[additionKey] = [ ...addition, ...outObject[additionKey]];
        }
      }
    }

    // The rest of this function checks if the primary name exists within the
    // alternative names array, and adds it if not found. This give the user a
    // single source of truth for querying names.

    // Create alt names array if it doesn't exist yet.
    if (!Array.isArray(outObject['namesAlt'])) {
      outObject['namesAlt'] = [];
    }

    // Remove all whitespace. This is to prevent issues where 'HD123' and
    // 'HD 123' are recognised as different names (both are valid in this
    // case).
    const flatPrimary = outObject.primaryName.replace(/\s/g,'').toLowerCase();
    const { namesAlt } = outObject;
    let foundPrimary = false;
    for (let i = 0, len = namesAlt.length; i < len; i++) {
      // Remove 'NAME ' as it's not part of the star name.
      const flatName = namesAlt[i].replace(/^NAME /g,'').replace(/\s/g,'').toLowerCase();
      if (flatPrimary === flatName) {
        foundPrimary = true;
        break;
      }
    }
    if (!foundPrimary) {
      namesAlt.push(outObject.primaryName);
    }
  }
  return outObject;
}
