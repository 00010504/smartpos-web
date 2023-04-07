import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import Select from "react-select/async";
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

export default function AsyncSelect({
  name,
  label,
  control,
  errors,
  options,
  selectProps,
  loadOptions,
  rightElementValue,
  styles,
}) {
  return (
    <FormControl isInvalid={!!errors[name]} my="4" marginTop={6}>
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
              loadOptions={loadOptions}
              isClearable={false}
              components={animatedComponents}
            />

            {rightElementValue ? (
              <InputRightElement cursor="pointer" mr="6" height="100%">
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

AsyncSelect.defaultProps = {
  errors: {},
  selectProps: {},
  rightElementValue: null,
  styles: {},
};

AsyncSelect.propTypes = {
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
  loadOptions: PropTypes.func.isRequired,
  selectProps: PropTypes.shape({}),
  rightElementValue: PropTypes.node,
  styles: PropTypes.objectOf(PropTypes.func),
};
