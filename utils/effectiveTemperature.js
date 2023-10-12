/**
 * Converts luminosity to effective temperature. Note that is an approximation
 * and will be wrong for some cases.
 * @param {number} luminosity
 * @return {number}
 */
function lumToEffectiveTemperature(luminosity) {
  // Stefan-Boltzmann constant in W*m^-2*K^-4
  const sigma = 5.67e-8;

  // Solar constants
  const solarLuminosity = 3.828e26; // in Watts
  const solarRadius = 6.9634e8; // in Meters

  // Convert input luminosity to Watts
  const starLuminosity = luminosity * solarLuminosity;

  // Calculate effective temperature
  return Math.pow(starLuminosity / (4 * Math.PI * Math.pow(solarRadius, 2) * sigma), 0.25);
}

/**
 * Converts effective temperature to luminosity. Note that is an approximation
 * and will be wrong for some cases.
 * @param {number} temperature
 * @return {number}
 */
function effectiveTemperatureToLum(temperature) {
  // Stefan-Boltzmann constant in W m^-2 K^-4
  const sigma = 5.67e-8;

  // Solar constants
  const solarLuminosity = 3.828e26; // in Watts
  const solarRadius = 6.9634e8; // in Meters

  // Compute luminosity
  return (
    4 * Math.PI * Math.pow(solarRadius, 2) * sigma * Math.pow(temperature, 4)
  ) / solarLuminosity;
}

export {
  lumToEffectiveTemperature,
  effectiveTemperatureToLum,
};
