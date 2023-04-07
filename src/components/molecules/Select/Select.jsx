import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Image,
  Text,
} from "@chakra-ui/react";
import RSelect from "react-select";
import makeAnimated from "react-select/animated";
import alertIcon from "@/assets/AlertRed.svg";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const animatedComponents = makeAnimated();

export const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    padding: "6px 5px",
    border: "1px solid",
    borderRadius: "10px",
    borderColor: "var(--ck-colors-colors-sidebarBorder) !important",
    "&:hover": state.selectProps.isInvalid
      ? {}
      : { borderColor: "#cbd5e0 !important" },
    fontWeight: "500",
    fontSize: "15px",
  }),
  menu: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    // zIndex: "10000 !important",
    zIndex: 112,
    maxHeight: "300px",
    overflow: "auto",
    backgroundColor: "var(--ck-colors-colors-heading)",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0",
  }),
  option: (provided) => ({
    ...provided,
    // transition: "0.15s all ease-in-out",
    backgroundColor: "var(--ck-colors-colors-grayF9)",
    "&:hover": {
      backgroundColor: "var(--ck-colors-brand-500)",
      color: "white",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--ck-colors-colors-gray4A)",
  }),
};

export default function Select({
  name,
  label,
  control,
  errors,
  options,
  selectProps,
  rightElementValue,
  styles,
  formControlProps,
  isRequired,
}) {
  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState(false);
  const condControlProps = isFocused
    ? {
        control: (provided) => {
          return {
            ...provided,
            padding: "6px 5px",
            borderRadius: "10px",
            fontWeight: "500",
            fontSize: "15px",
            boxShadow: "0 0 0 1px #2684ff",
            borderColor: "#2684ff",
          };
        },
      }
    : {};

  return (
    <FormControl isInvalid={!!errors[name]} {...formControlProps}>
      <FormLabel htmlFor={name}>
        {t(label)}{" "}
        {isRequired && (
          <Text color="red" as="b" ml="1px">
            *
          </Text>
        )}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputGroup isolation="auto" size="md">
            <RSelect
              placeholder={t("select")}
              id={name}
              {...field}
              {...selectProps}
              options={options}
              styles={{
                ...customStyles,
                ...condControlProps,
                ...styles,
              }}
              isClearable={false}
              components={animatedComponents}
              classNamePrefix="select"
              isSearchable
              isInvalid={!!errors[name]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {rightElementValue ? (
              <InputRightElement cursor="pointer" mr="8" height="100%">
                {rightElementValue}
              </InputRightElement>
            ) : null}
          </InputGroup>
        )}
      />

      {errors[name] && (
        <FormErrorMessage p="1">
          <Image
            src={alertIcon}
            alt="alert"
            marginRight="5px"
            transform="translateY(-1.2px)"
          />{" "}
          {errors[name]?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

Select.defaultProps = {
  errors: {},
  selectProps: {},
  rightElementValue: null,
  styles: {},
  formControlProps: {},
  isRequired: false,
  label: "",
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
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
  formControlProps: PropTypes.shape({}),
  isRequired: PropTypes.bool,
};
