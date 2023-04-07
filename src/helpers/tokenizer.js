export default function tokenizer(input) {
  let current = 0;
  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (char === "{") {
      tokens.push({
        type: "brace",
        value: "{",
      });
      current++;
      continue;
    }

    if (char === "}") {
      tokens.push({
        type: "brace",
        value: "}",
      });
      current++;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    let LETTERS = /[a-z_]/i;
    if (LETTERS.test(char)) {
      let value = "";

      while (char && LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "string", value });
      continue;
    }

    throw new TypeError("Unsupported character: " + char);
  }

  return tokens;
}
