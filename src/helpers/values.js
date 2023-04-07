/**
 *
 * @param {Object} obj Target to convert its enumberable property values to an array
 * @param {Object} filter configuration to customize filtering
 * @returns {Array} Array of object's filtered values
 */

export default function values(obj, filter) {
  const { exclude } = filter;

  return Object.keys(obj)
    .filter((key) => {
      if (Array.isArray(exclude)) {
        return !exclude.includes(key);
      }
      if (typeof exclude === "string") {
        return key !== exclude;
      }
      return true;
    })
    .map((key) => obj[key]);
}
