/* eslint-disable no-extend-native */
/* eslint-disable spaced-comment */
export default async function initialize() {
  if (import.meta.env.MODE === "production") {
    console.log = function noConsole() {};

    const prepareLSForProduction = (
      await import("@/helpers/prepareLSForProduction")
    ).default;
    prepareLSForProduction();
  }

  /*** AUGMENTING PROTOTYPES ***/

  /* String.prototype.toCapitalCase */
  String.prototype.toCapitalCase = function toCapitalCase(separator = " ") {
    return this.split(separator)
      .map((word) => {
        const firstLetter = word[0].toUpperCase();
        const rest = word.slice(1);
        return firstLetter + rest;
      })
      .join(" ");
  };
}
