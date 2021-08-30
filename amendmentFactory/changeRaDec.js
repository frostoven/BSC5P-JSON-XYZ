// Amendments for default star parallax.

const positionOverrides = {
  /* Example:
  ******************************************
  1000: {
    // Comment or reason for change.
    changeRaTo: [ 0, 0, 0],
    changeDecTo: [ 0, 0, 0],
    fallback: [ 'Three', 'known', 'names' ],
  },
  ******************************************
  */

  // 1948: {
  //   // ** The red one **
  //   // Default data is visibly wrong. Specifically, declination seems to be off
  //   // by roughly 1 degree (default is -1).
  //   changeRaTo: [ 5, 40, 45.5 ],
  //   changeDecTo: [ -1, 56, 34 ],
  //   fallback: [ '* zet Ori A', 'GCRV 3517', 'ADS 4263 A' ],
  // },
  // 1949: {
  //   // Default data is visibly wrong. Specifically, declination seems to be off
  //   // by roughly 1 degree (default is -1).
  //   changeRaTo: [ -1, 40, 45.6 ],
  //   changeDecTo: [ -1, 26, 34 ],
  //   fallback: [ '* 50 Ori B', 'GCRV 3518', 'ADS 4263 B' ],
  // },
};

// Changes the default parallax value if any overrides have been defined.
function changeRaDec(lineId, { rightAscension, declination }) {
  const overrides = positionOverrides[lineId];
  if (overrides) {
    rightAscension = overrides.changeRaTo;
    declination = overrides.changeDecTo;
  }
  return { rightAscension, declination };
}

module.exports = changeRaDec;
