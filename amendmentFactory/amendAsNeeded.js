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
  595: {
    // Star does not have parallax info by default.
    // Source: https://uk.wikipedia.org/wiki/HD12446
    overrides: {
      parallax: 0.02345,
    },
    fallback: [ 'HD12446', '* alf Psc B', 'WEB 1992' ],
  },
  887: {
    // Star does not have parallax info by default.
    // Source: https://uk.wikipedia.org/wiki/HD18519
    overrides: {
      parallax: 0.01115,
    },
    fallback: [ 'HD18519', 'PLX 620', 'WEB 2745' ],
  },
  1230: {
    // Star does not have parallax info by default.
    // Source: https://www.universeguide.com/star/19461/hd25007
    overrides: {
      parallax: 0.00859,
    },
    fallback: [ 'HD25007', 'TYC 4522-1564-1', 'WEB 3733' ],
  },
  1417: {
    // Star does not have parallax info by default.
    // Source: https://en.wikipedia.org/wiki/1_Camelopardalis
    overrides: {
      parallax: 0.00125,
    },
    fallback: [ 'HD28446', '* 1 Cam', 'WEB 4067' ],
  },
  1504: {
    // Star does not have parallax info by default.
    // Source: https://www.universeguide.com/star/21756/hip21756
    overrides: {
      parallax: 0.03268,
    },
    fallback: [ 'HIP 21756', 'HD30003', 'HR1504' ],
  },
  1505: {
    // Star does not have parallax info by default.
    // Source: https://uk.wikipedia.org/wiki/HD30020
    overrides: {
      parallax: 0.008039,
    },
    fallback: [ 'HD30020', 'TIC 56129374', 'Renson 7710' ],
  },
  1701: {
    // Star does not have parallax info by default.
    // Source: https://www.universeguide.com/star/24349/hd33883
    overrides: {
      parallax: 0.00471,
    },
    fallback: [ 'HD33883', 'BD+01 938A', 'WEB 4726' ],
  },
  1704: {
    // Star does not have parallax info by default.
    // Source: https://gea.esac.esa.int/archive/
    overrides: {
      parallax: 0.003695589756130208,
    },
    fallback: [ 'HD33948', 'BD-08 1059', 'CEL 574' ],
  },
  1771: {
    // Star does not have parallax info by default.
    // https://www.universeguide.com/star/25045/hd35162#distance
    overrides: {
      parallax: 0.00927,
    },
    fallback: [ 'HD35162', 'HIP25045', 'WEB 4858' ],
  },
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
  2332: {
    // Star does not have parallax info by default, and is missing a pop name.
    // Source: https://www.universeguide.com/star/30827/rtaurigae#distance
    overrides: {
      parallax: 0.00209,
    },
    additions: {
      // Source: https://www.universeguide.com/star/30827/rtaurigae#distance
      namesAlt: [ 'NAME RT Aurigae' ],
    },
    fallback: [ 'HD45412', 'PLX 1500', '* 48 Aur' ],
  },
  2670: {
    // Star does not have parallax info by default.
    // Source: https://www.wikidata.org/wiki/Q3781275
    overrides: {
      parallax: 0.00092,
    },
    fallback: [ 'HD53755', 'ALS 156', 'WEB 6857' ],
  },
  2859: {
    // Star does not have parallax info by default.
    // Source: https://www.universeguide.com/star/36251/hd59067#distance
    overrides: {
      parallax: 0.00206,
    },
    fallback: [ 'HD59067', 'HR2859', 'HR2859' ],
  },
  2870: {
    // Star does not have parallax info by default.
    // Source: https://www.universeguide.com/star/36345/hip36345#distance
    overrides: {
      parallax: 0.00438,
    },
    fallback: [ 'HD59499', 'GC 10020', 'WEB 7231' ],
  },
  2890: {
    // Star does not have parallax info by default.
    // Source: https://en.wikipedia.org/wiki/Castor_(star)
    // Note: AKA Castor, this is actually a 6-star system.
    overrides: {
      parallax: 0.06410256410256411,
    },
    fallback: [ 'HD60178', 'NAME Castor B', 'WEB 7319' ],
  },
  2891: {
    // Star does not have parallax info by default.
    // Source: https://www.universeguide.com/star/36850/castor#distance
    // Note: AKA Castor, this is actually a 6-star system.
    overrides: {
      parallax: 0.06412,
    },
    fallback: [ 'HD60179', 'Alpha Geminorum', 'WEB 7320' ],
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
