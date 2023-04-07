import { useEffect, useRef, useState } from "react";
import {
  Input,
  Menu,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import Highlighter from "react-highlight-words";
import diff from "fast-diff";
import setCaretPosition from "@/helpers/setCaretPosition";
import tokenizer from "@/helpers/tokenizer";

// const options = [
//   { label: "sku", value: "sku" },
//   { label: "name", value: "name" },
//   { label: "sale_price", value: "sale_price" },
// ];

let prevValue = "";
let closingBracePos;
// let keyPressed;

export default function AutoComplete({ options }) {
  const [rawValue, setRawValue] = useState("");
  const [searchWord, setSearchWord] = useState([]);
  const inputRef = useRef();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // const changeHandler = (e) => {
  //   const { value } = e.target;
  //   const tokens = e.target.value.split("");

  //   const enteredChar = value.replace(prevValue, "");

  //   if (enteredChar === "{") {
  //     const tokensWithClosedBrace = tokens.reduce((acc, curr, index) => {
  //       if (curr === "{" && index === tokens.length - 1) {
  //         return acc.concat(curr, "}");
  //       }
  //       return acc.concat(curr);
  //     }, []);

  //     closingBracePos = tokensWithClosedBrace.findLastIndex(
  //       (token) => token === "}",
  //     );

  //     const newValue = tokensWithClosedBrace.join("");
  //     setRawValue(newValue);
  //   } else {
  //     setRawValue(value);
  //     closingBracePos = null;
  //   }
  // };

  // const changeHandler = (e) => {
  //   let input = e.target.value;

  //   if (keyPressed === "Backspace") {
  //     if (input.trimEnd().at(-1) === "{") {
  //       input = input.trimEnd().slice(0, -1);
  //     }
  //   }

  //   if (keyPressed === " ") {
  //     setRawValue(input);
  //     return;
  //   }

  //   try {
  //     const tokens = tokenizer(input);
  //     const transformed = transformer(tokens);
  //     const generated = generator(transformed);
  //     setRawValue(generated);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const addOption = (option) => {
    setRawValue((prev) => {
      const chars = prev.split("");
      let index = chars.findIndex((char) => char === "{");
      if (chars[index + 1] !== "}") {
        index = chars.findLastIndex((char) => char === "{");
      }
      chars.splice(index + 1, 0, option);
      return chars.join("");
    });
    setCaretPosition(inputRef.current, rawValue.length - 1);
    onClose();
  };

  const changeHandler = (e) => {
    const { value } = e.target;
    const tokens = tokenizer(value);
    console.log(tokens);

    // last {type: 'brace', value: '}'} token index
    const lastCloseBraceTokenIndex = tokens
      .map((token, index) => ({ ...token, index }))
      .findLastIndex((token) => token.type === "brace" && token.value === "}");

    const lastOpenBraceTokenIndex = tokens
      .map((token, index) => ({ ...token, index }))
      .findLastIndex((token) => token.type === "brace" && token.value === "{");

    if (tokens.at(-2)?.value === "{" && tokens.at(-1)?.value === "}") {
      closingBracePos = value.length - 1;
    }

    // if (prevValue) {
    //   let changes = diff(prevValue, value);
    //   changes = transformer(changes);
    //   console.log(changes);
    // }

    prevValue = value;
    setRawValue(value);
    return setSearchWord([
      tokens[lastOpenBraceTokenIndex + 1].value,
      tokens[lastCloseBraceTokenIndex - 1].value,
    ]);
  };

  console.log(searchWord);

  useEffect(() => {
    if (typeof closingBracePos === "number") {
      setCaretPosition(inputRef.current, closingBracePos);
      closingBracePos = null;
      onOpen();
    }
  }, [rawValue, onOpen]);

  return (
    <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef}>
      <PopoverTrigger>
        <Input ref={inputRef} onChange={changeHandler} value={rawValue} />
      </PopoverTrigger>
      <PopoverContent visibility="hidden !important">
        <PopoverBody>
          <Menu isOpen={isOpen}>
            <MenuList>
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => addOption(option.value)}
                >
                  <Highlighter
                    searchWords={searchWord}
                    autoEscape
                    textToHighlight={option.label}
                  />
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const hash_map = {
  0: "equal",
  1: "insert",
  "-1": "delete",
};

function transformer(changes) {
  return changes.map(([id, token]) => ({ action: hash_map[id], token }));
}

AutoComplete.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
};
