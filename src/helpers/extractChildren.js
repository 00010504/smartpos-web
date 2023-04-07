import { cloneDeep } from "lodash";

/**
 *
 * @param {Array} arr Array of objects with children
 * @returns {Array} Flattened array of objects without children
 * @example
 * const arr = [{name: "React", children: [{name: "Preact"}]}, {name:"Vue", children: [{name: "Svelte"}]}];
 * const result = extractChildren(arr);
 * result; // [{name: "React"}, {name: "Preact"}, {name:"Vue"}, {name: "Svelte"}]
 */
export default function extractChildren(arr) {
  return arr.reduce((acc, curr) => {
    const clonedCurr = cloneDeep(curr);

    const item = [clonedCurr];
    if (clonedCurr.children) {
      item.push(...extractChildren(clonedCurr.children));
    }
    clonedCurr.children = undefined;
    return acc.concat(item);
  }, []);
}
