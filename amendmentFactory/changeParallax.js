// Amendments for default star parallax.

const parallaxOverrides = {
  /* Example:
  ******************************************
  1000: {
    // Comment or reason for change.
    changeTo: newValue,
    fallback: [ 'Three', 'known', 'names' ],
  },
  ******************************************
  */
  1948: {
    // We do not have data for this by default.
    changeTo: 0.0025,
    fallback: [ '* zet Ori A', 'GCRV 3517', 'ADS 4263 A' ],
  },
  1949: {
    // We do not have data for this by default.
    changeTo: 0.0025,
    fallback: [ '* 50 Ori B', 'GCRV 3518', 'ADS 4263 B' ],
  },
};

// Changes the default parallax value if any overrides have been defined.
function changeParallax(lineId, parallax) {
  const overrides = parallaxOverrides[lineId];
  if (overrides) {
    parallax = overrides.changeTo;
  }
  return parallax;
}

module.exports = changeParallax;
