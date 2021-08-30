// Adds a star not current in the catalogs.

let customId = 0;

// Note: always add custom starts AT THE END of the starData array, otherwise
// it'll change the identification of existing stars.
const starData = [
  /* Example:
  ******************************************
  {
    // You reason for adding the star here.
    lineNumber: customId++,
    customStarName: 'Test star',
    additionalNames: [ 'Any additional names', 'you wish', 'to add' ],
    ra: '2 13 45',
    dec: '-0 1 9.9',
    visualMagnitude: 0.1,
    parallax: 0.03,
    spectralType: 'A1Vn',
  },
  ******************************************
  */
];

// Adds additional names to namesArray, if any additional exists.
function loopThroughCustomStars(callback=()=>{}) {
  for (let i = 0, len = starData.length; i < len; i++) {
    const star = starData[i];
    star.lineNumber = `Custom ${star.lineNumber}`;
    if (!star.customAdditionalNames) {
      star.customAdditionalNames = [];
    }
    callback(star);
  }
}

module.exports = loopThroughCustomStars;
