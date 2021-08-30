// This file should not be called directly, but rather used as an import.
//
// Specifies changes that should be made to star data when converting Simbad
// catalogs to game-friendly JSON.

const changeDefaultName = require('./changeDefaultName');
const changeParallax = require('./changeParallax');
const changeRaDec = require('./changeRaDec');
const addNames = require('./addNames');
const loopThroughCustomStars = require('./loopThroughCustomStars');

const changeIfNeeded = {
  defaultName: changeDefaultName,
  parallax: changeParallax,
  raDec: changeRaDec,
};

const appendData = {
  addNames,
};

const loopThroughData = {
  customStars: loopThroughCustomStars,
};

module.exports = {
  changeIfNeeded,
  appendData,
  loopThroughData,
};
