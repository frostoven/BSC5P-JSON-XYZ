// This file should not be called directly, but rather used as an import.
//
// Specifies changes that should be made to star data when converting Simbad
// catalogs to game-friendly JSON.

import changeDefaultName from './changeDefaultName';
import changeParallax from './changeParallax';
import changeRaDec from './changeRaDec';
import addNames from './addNames';
import loopThroughCustomStars from './loopThroughCustomStars';

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

export {
  changeIfNeeded,
  appendData,
  loopThroughData,
};
