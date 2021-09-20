// Amendments for default star names.

// See CONTRIBUTING.md for information on how to adjust this.
const nameOverrides = {
  /* Example:
  ******************************************
  1000: {
    // Comment or reason for change.
    changeTo: 'New Name',
    fallback: [ 'Other', 'known', 'names' ],
  },
  ******************************************
  */
  1879: {
    // Default is HD36861, which is not ideal. Use popular name instead.
    changeTo: 'Meissa A',
    fallback: [ '* 39 Ori A', 'CEL 811', 'Gaia DR2 3337991583942617088' ],
  },
  1880: {
    // Default is HD36862, which is not ideal. Use popular name instead.
    changeTo: 'Meissa B',
    fallback: [ '* 39 Ori B', 'BD+09 879B', 'Gaia DR2 3337991583942616704' ],
  },
  1948: {
    // Default is HD37742, which is not ideal. Use popular name instead.
    changeTo: 'Alnitak A',
    fallback: [ '* zet Ori A', 'GCRV 3517', 'ADS 4263 A' ],
  },
  1949: {
    // Default is HD37743, which is not ideal. Use popular name instead.
    changeTo: 'Alnitak B',
    fallback: [ '* 50 Ori B', 'GCRV 3518', 'ADS 4263 B' ],
  },
};

// Changes the default name if any overrides have been defined.
function changeDefaultName(lineId, starName, alternativeNames=[]) {
  const overrides = nameOverrides[lineId];
  if (overrides) {
    starName = overrides.changeTo;
  }
  else if (alternativeNames) {
    for (let i = 0, len = alternativeNames.length; i < len; i++) {
      const name = alternativeNames[i];
      if (typeof name === 'string' && name.length > 5 && name.substr(0, 5) === 'NAME ') {
        // Found popular name. Use that.
        return name.substr(5);
      }
    }
  }
  return starName;
}

export default changeDefaultName;
