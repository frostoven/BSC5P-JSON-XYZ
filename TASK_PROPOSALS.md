# Task Proposals from Codebase Review

## 1) Typo fix task
**Task:** Correct misspelled wording in parser docs/comments for clarity and professionalism.

**Why:** The JSDoc in `utils/extractSpectralInfo.js` says "romain numerals" instead of "Roman numerals", and nearby comments include grammar mistakes (e.g., "Loop though").

**Suggested acceptance criteria:**
- Replace "romain" with "Roman".
- Fix nearby grammar typos without changing runtime behavior.
- Keep comment meaning intact.

## 2) Bug fix task
**Task:** Fix luminosity class parsing for slash-delimited values in `parseRomanLuminosity`.

**Why:** In `utils/averageOutLuminosityInfo.js`, slash-separated classes are incorrectly split with `'-'` instead of `'/'`, which can silently mis-parse inputs like `III/IV`.

**Suggested acceptance criteria:**
- Change slash branch to `string.split('/')`.
- Add regression tests for both `III-IV` and `III/IV`.
- Confirm function returns expected averaged class values for both delimiters.

## 3) Comment/documentation discrepancy task
**Task:** Align `kelvinToRGB` documentation with actual clamp behavior and units.

**Why:** The comment states an allowed range of "50k to 100000k", but the implementation clamps from `50` to `100000` (Kelvin). "50k" implies 50,000 K and does not match behavior.

**Suggested acceptance criteria:**
- Update doc comment to a precise unit statement (e.g., "50 K to 100,000 K").
- Keep implementation unchanged unless project intentionally wants a different clamp range.
- Add one short example in docs showing clamp behavior.

## 4) Test improvement task
**Task:** Replace placeholder/non-executing tests with real assertions and wire them to `npm test`.

**Why:** `package.json` currently defines `test` as a failing placeholder (`"Error: no test specified"`), and `tests/testExtractSpectralInfo.js` is entirely commented out, so parser behavior is not automatically validated.

**Suggested acceptance criteria:**
- Update `npm test` script to run test files.
- Convert commented test cases into executable assertion-based tests.
- Ensure CI (or local `npm test`) passes and verifies at least one spectral parse edge case.
