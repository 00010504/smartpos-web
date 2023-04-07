import { get, isPlainObject } from "lodash";

/**
 * @param {Object} target
 * @param {Object} config
 * @param {string} config.path
 * @param {string} config.valuePath
 * @param {string} config.labelPath
 * @returns {Object|Array} An array of select options or a single one: { value: any, label: any }
 * @throws {Error}
 * @example
 * const target = {
 *  shop_prices: [
 *   {
 *    supply_price: 100,
 *    retail_price: 200,
 *   },
 *   {
 *    supply_price: 100,
 *    retail_price: 200,
 *   },
 *  ],
 * };
 * const config = {
 *  path: "shop_prices",
 *  valuePath: "supply_price",
 *  labelPath: "retail_price",
 * };
 * const result = genSelectOptions(target, config);
 * // result = [
 * //  { value: 100, label: 200 },
 * //  { value: 100, label: 200 },
 * // ]
 */

export default function genSelectOptions(target, config) {
  let field = target;
  const { path, valuePath, labelPath } = config;

  if (!target) {
    throw new Error("genSelectOptions: missing required target");
  }

  if (!valuePath || !labelPath) {
    throw new Error("genSelectOptions: missing required config");
  }

  if (path) {
    field = get(target, path);
  }

  if (Array.isArray(field)) {
    return field.map((el) => ({
      value: get(el, valuePath),
      label: get(el, labelPath),
    }));
  }

  if (isPlainObject(field)) {
    return {
      value: get(field, valuePath),
      label: get(field, labelPath),
    };
  }

  return "";
}
