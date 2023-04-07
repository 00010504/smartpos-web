/**
 * A function to shortening numbers to K, M, B
 * @param {array} number Large number to be shortened
 * @returns {object} string value of shortened number
 * @example <caption>Here we shorten number</caption>
 * const followers = shortenNum(4000000)
 * // followers = 4M
 * @requires none
 * @requires none
 * @see {@link src/utils/shortenNum.js}
 * @see {@link src/components/templates/Dashboard/TopClients.jsx}
 */

import priceFormatter from "./priceFormatter";

const shortenNum = (number) => {
  if (number > 1000000000) {
    return `${(number / 1000000000).toFixed(4).toString()} B`;
  }
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(2).toString()} M`;
  }
  // if (number > 1000) {
  //   return `${(number / 1000).toString()}K`;
  // }
  return priceFormatter(number);
};

export default shortenNum;
