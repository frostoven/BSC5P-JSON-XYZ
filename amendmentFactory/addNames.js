// Adds an additional name to list of names.

const extraNames = {
  /* Example:
  ******************************************
  1000: {
    // Comment or reason for change.
    add: [ 'New Name' ],
    fallback: [ 'Other', 'known', 'names' ],
  },
  ******************************************
  */
  1852: {
    // Add colloquial name.
    add: [ 'Orion\'s Belt (left)' ],
    fallback: [ 'Mintaka', '* eps Ori', 'HD 37128' ],
  },
  1903 : {
    // Add colloquial name.
    add: [ 'Orion\'s Belt (center)' ],
    fallback: [ 'Alnilam', '* eps Ori', 'HD 37128', ],
  },
  1948: {
    // Part of triple star system Zeta Orionis, missing the name 'Alnitak A'.
    add: [ 'Alnitak A', 'Orion\'s Belt (right)' ],
    fallback: [ '* 50 Ori A', 'HD 37742', 'WEB 5270' ],
  },
  1949: {
    // Part of triple star system Zeta Orionis, missing the name 'Alnitak B'.
    add: [ 'Alnitak B', 'Orion\'s Belt (right)' ],
    fallback: [ '* zet Ori B', 'HD 37743', 'WEB 5271' ],
  },
};

// Adds additional names to namesArray, if any additional exists.
function addNames(lineId, namesArray) {
  const extra = extraNames[lineId];
  if (extra) {
    namesArray.push(...extra.add);
  }
  return namesArray;
}

module.exports = addNames;
