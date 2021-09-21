// function test(item){console.log(`${item}:`, averageNumberRange(item));}
// test('0');
// test('0.5');
// test('1-3');
// test('5/10');
// test('3.2/7.5');
// test('3.2-7.5');
// test('9/');
// test('9-');
// test('9');

// Test getClassPerc
// console.log(getClassPerc('O'));
// console.log(getClassPerc('B'));
// console.log(getClassPerc('F'));
// console.log(getClassPerc('K'));
// console.log(getClassPerc('M'));

// Test getStarColor
// getStarColor('O', '4');
// getStarColor('O', '0');
// getStarColor('M', '0');
// getStarColor('M', '9');

// Test colour averaging

// console.log(getStarColors({
//   "spectralClass": "M",
//   "spectralSubclass": "4.5",
//   "luminosityClass": "III",
//   "to": null,
//   "or": null,
//   "siblings": [],
//   "skipped": ":"
// }));
//
//
// console.log('K', getStarColors({
//   "spectralClass": "K",
//   "spectralSubclass": "9",
//   "luminosityClass": "Ia",
//   "to": null,
//   "or": null,
//   // "or": {
//   //   "spectralClass": "B",
//   //   "spectralSubclass": "2",
//   //   "luminosityClass": "V",
//   //   "to": null,
//   //   "or": null
//   // },
//   "siblings": [],
//   "skipped": ""
// }));
//
//
// console.log('B', getStarColors({
//   "spectralClass": "B",
//   "spectralSubclass": "2",
//   "luminosityClass": "V",
//   "to": null,
//   "or": null,
//   "siblings": [],
// }));


// const combined = {
//   "spectralClass": "K",
//   "spectralSubclass": "9",
//   "luminosityClass": "Ia",
//   "to": null,
//   "or": {
//     "spectralClass": "B",
//     "spectralSubclass": "2/3",
//     "luminosityClass": "V",
//     "to": null,
//     "or": null
//   },
//   "siblings": [],
//   "skipped": ""
// };
// // console.log('Combined object:', combined);
// console.log('result:', getStarColors(combined));
// console.log('redundants removed:', removeRedundantColorInfo(getStarColors(combined)));
// console.log('-------------------------------------------------');


// const itemWithSiblings = {
//   "spectralClass": "K",
//   "spectralSubclass": "9",
//   "luminosityClass": "Ia",
//   "to": null,
//   "or": null,
//   "siblings": [
//     {
//       "spectralClass": "B",
//       "spectralSubclass": "2",
//       "luminosityClass": "V",
//       "to": null,
//       "or": null
//     }
//   ],
//   "skipped": ""
// };
// // console.log('Combined object:', itemWithSiblings);
// console.log('result:', getStarColors(itemWithSiblings));
// console.log('redundants removed:', removeRedundantColorInfo(getStarColors(itemWithSiblings)));

//
// const itemWithSiblings = {
//   "spectralClass": "F",
//   "spectralSubclass": "8",
//   "luminosityClass": "IV-V",
//   "to": null,
//   "or": null,
//   "siblings": [
//     {
//       "spectralClass": "F",
//       "spectralSubclass": "9",
//       "luminosityClass": "IV-V",
//       "to": null,
//       "or": null
//     }
//   ],
//   "skipped": ""
// };
// console.log('-------------------------------------------------');
// console.log('result:', getStarColors(itemWithSiblings));
// console.log('Combined object:', itemWithSiblings);
