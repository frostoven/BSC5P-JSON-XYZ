// Looks for HD, SAO, DM, FK5, Bayer/Flamsteed, and NOVA names and returns the
// first it finds.
// If NOVA, renames NOVA to SN.
// If M and M has trailing text, remove the trailing text.
function getStarName(star) {
  let name = null;

  // Find a name.
  if (star.hdId) {
    name = 'HD' + star.hdId;
  }
  else if (star.saoId) {
    name = 'SAO' + star.saoId;
  }
  else if (star.dmId) {
    // Exclude prefix on this one. It's part of the name.
    name = star.dmId;
  }
  else if (star.fk5Id) {
    // Be mindful of the space here, the query will fail without it.
    name = 'FK5 ' + star.fk5Id;
  }
  else if (star.bayerAndOrFlamsteed) {
    // Exclude prefix on this one. It's part of the name if specified.
    name = star.bayerAndOrFlamsteed;
  }
  else if (star.customStarName) {
    // customName is used by the 'addCustomStars' amendment script and is not
    // included in the original BSC5P data.
    name = star.customStarName;
  }

  if (!name) {
    return null;
  }

  if (name.substr(0, 5) === 'NOVA ') {
    // The API target has a different name for these:
    name = name.replace('NOVA ', 'SN');
    // It appears many of these are missing though (which makes sense - they
    // blow up and vanish.. then again, we should see remnants).
  }

  if (name.substr(0, 2) === 'M ' && name.substr(-4) === ' And') {
    // I've seen name like "M 31  And" which is rejected by the API. In this
    // example it should be renamed to either "M 31" or "M31".
    name = name.replace(new RegExp('And$'), '').trim();
  }

  return name;
}

module.exports = getStarName;
