// Amendments for default star parallax.

// See CONTRIBUTING.md for information on how to adjust this.
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

export default changeRaDec;
