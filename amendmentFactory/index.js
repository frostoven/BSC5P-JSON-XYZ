// This file should not be called directly, but rather used as an import.
//
// Specifies changes that should be made to star data when converting Simbad
// catalogs to game-friendly JSON.

import loopThroughCustomStars from './loopThroughCustomStars';
import amendAsNeeded from './amendAsNeeded';

// Adds stars not in existing catalogs.
// NOTE: do not use this to modify existing stars - only use this to add stars
// not already in catalogs used here. Use amendAsNeeded for existing stars.
const loopThroughData = {
  customStars: loopThroughCustomStars,
};

export {
  loopThroughData,
  amendAsNeeded,
};
