import PropTypes from "prop-types";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { forwardRef } from "react";

const Search = forwardRef(
  (
    {
      onBlur,
      onFocus,
      search,
      inputProps,
      placeholder,
      leftElementValue,
      containerProps,
      inputRightElement,
    },
    ref,
  ) => {
    const value = search?.value ? { value: search?.value } : {};
    return (
      <InputGroup width="auto" {...containerProps}>
        {leftElementValue ? (
          <InputLeftElement pointerEvents="none">
            {leftElementValue}
          </InputLeftElement>
        ) : null}
        <Input
          ref={ref}
          placeholder={placeholder}
          onChange={(e) => search.onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          {...value}
          {...inputStyles}
          {...inputProps}
          color="colors.text"
          _placeholder={{
            color: "colors.placeholder !important",
            fontWeight: "400",
            fontSize: "md",
          }}
        />
        {inputRightElement && (
          <InputRightElement
            transform="translateY(-50%)"
            top="50%"
            right="8%"
            zIndex="sticky"
          >
            {inputRightElement}
          </InputRightElement>
        )}
      </InputGroup>
    );
  },
);

Search.defaultProps = {
  inputProps: {},
  placeholder: "",
  containerProps: {},
  leftElementValue: null,
  placeholderProps: {},
  inputRightElement: null,
  onBlur: () => {},
  onFocus: () => {},
};

Search.propTypes = {
  search: PropTypes.exact({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,
  inputProps: PropTypes.objectOf(PropTypes.string),
  placeholder: PropTypes.string,
  leftElementValue: PropTypes.node,
  containerProps: PropTypes.shape({}),
  placeholderProps: PropTypes.shape({}),
  inputRightElement: PropTypes.node,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default forwardRef((props, ref) => <Search ref={ref} {...props} />);

const inputStyles = {
  margin: "10px auto",
  marginTop: "20px",
  padding: "23px 16px",
  borderRadius: "10px",
  fontWeight: "400",
  border: "1px solid #ECECEC",
  color: "#000",
  minWidth: "350px",
  width: "480px",
};
