/* eslint-disable no-restricted-syntax */

export default function parseParams(params, to = "obj") {
  if (to === "obj") {
    const parsedParams = {};

    params.forEach((value, key) => {
      parsedParams[key] = value;
    });

    return parsedParams;
  }

  const parsedParams = [];

  for (const [key, value] of params.entries()) {
    parsedParams.push({ [key]: value });
  }

  return parsedParams;
}
