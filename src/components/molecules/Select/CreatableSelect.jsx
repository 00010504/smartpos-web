import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Image,
  Flex,
  Box,
} from "@chakra-ui/react";
import Select from "react-select/creatable";
import makeAnimated from "react-select/animated";
import alertIcon from "@/assets/AlertRed.svg";
import PropTypes from "prop-types";

const animatedComponents = makeAnimated();

const customStyles = {
  container: () => ({
    width: "100%",
  }),
  control: (provided) => ({
    ...provided,
    padding: "6px 5px",
    borderRadius: "10px",
    border: "1px solid #cbddec",
    fontWeight: "500",
    fontSize: "15px",
  }),
  menu: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 112,
  }),
  menuList: () => ({
    padding: "0",
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: "1px solid #e5e5e5",
    transition: "0.15s all ease-in-out",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

export default function CreatableSelect({
  name,
  label,
  control,
  errors,
  options,
  selectProps,
  rightElementValue,
  styles,
}) {
  const formatCreateLabel = (inputValue) => {
    return (
      <Flex justifyContent="space-between">
        {inputValue}{" "}
        <Box as="span" color="#256df6">
          (Create new)
        </Box>
      </Flex>
    );
  };

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputGroup size="md">
            <Select
              id={name}
              {...field}
              {...selectProps}
              options={options}
              styles={{ ...customStyles, ...styles }}
              formatCreateLabel={formatCreateLabel}
              isClearable={false}
              components={animatedComponents}
            />

            {rightElementValue ? (
              <InputRightElement cursor="pointer" mr="32px" height="100%">
                {rightElementValue}
              </InputRightElement>
            ) : null}
          </InputGroup>
        )}
      />

      {errors[name] && (
        <FormErrorMessage p="1">
          <Image src={alertIcon} alt="alert" marginRight="5px" />{" "}
          {errors[name]?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

CreatableSelect.defaultProps = {
  errors: {},
  selectProps: {},
  rightElementValue: null,
  styles: {},
};

CreatableSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectProps: PropTypes.shape({}),
  rightElementValue: PropTypes.node,
  styles: PropTypes.objectOf(PropTypes.func),
};
