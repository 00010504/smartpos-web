const checks = [
  (token) => token.trim().length >= 300,
  (token) => token.trim().length <= 360,
];

/**
 * A function that validates a token with minimum requirements and returns a boolean value
 * @param {string} token Bearer token to be validated from the AuthProvider.jsx
 * @returns {boolean} boolean value
 * @example <caption>Here we validate token</caption>
 * const isValid = validateToken(token);
 * // isValid = true || false
 * @requires none
 * @see {@link src/utils/validateToken.js}
 * @see {@link src/providers/AuthProvider.jsx}
 */

export default function validateToken(token) {
  let isValid = true;

  if (typeof token === "string") {
    checks.forEach((check) => {
      if (!check(token)) {
        isValid = false;
      }
    });
  } else {
    isValid = false;
  }

  return isValid;
}
