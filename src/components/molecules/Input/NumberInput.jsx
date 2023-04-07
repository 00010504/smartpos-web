import { Controller } from "react-hook-form";
import {
  NumberInputField,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  Image,
  NumberInput as ChakraNumberInput,
  FormControl,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import alertIcon from "@/assets/AlertRed.svg";
import { flow, get } from "lodash";

export default function NumberInput({
  name,
  label,
  control,
  errors,
  inputProps,
  leftAddonValue,
  rightAddonValue,
  leftElementValue,
  rightElementValue,
  formControlProps,
  setValue,
  value,
  defaultValue,
  onChange,
  isRequired,
}) {
  const parse = (val) => val.replace(/^\$/, "");

  const setFormattedValue = (val) => {
    const parsedValue = parse(val);
    setValue(name, parsedValue);
  };

  const composedOnChange = (e) => {
    return flow([onChange, setFormattedValue])(e.target.value);
  };

  const error = get(errors, name);

  return (
    <FormControl {...formControlProps} isInvalid={!!error}>
      <ChakraNumberInput value={value} defaultValue={defaultValue}>
        <FormLabel htmlFor={name}>
          {label}{" "}
          {isRequired && (
            <Text display="inline-block" color="red">
              *
            </Text>
          )}
        </FormLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <InputGroup size="md">
              {leftAddonValue ? (
                <InputLeftAddon>{leftAddonValue}</InputLeftAddon>
              ) : null}

              {leftElementValue ? (
                <InputLeftElement pointerEvents="none">
                  {leftElementValue}
                </InputLeftElement>
              ) : null}

              <NumberInputField
                id={name}
                {...field}
                {...inputProps}
                errorBorderColor="blue"
                autoComplete="off"
                onChange={composedOnChange}
              />

              {rightElementValue ? (
                <InputRightElement top={1} width="3rem" cursor="pointer">
                  {rightElementValue}
                </InputRightElement>
              ) : null}

              {rightAddonValue ? (
                <InputRightAddon>{rightAddonValue}</InputRightAddon>
              ) : null}
            </InputGroup>
          )}
        />
        {error && (
          <FormErrorMessage p="1" display="flex">
            <Image src={alertIcon} alt="alert" marginRight="5px" />{" "}
            {error?.message}
          </FormErrorMessage>
        )}
      </ChakraNumberInput>
    </FormControl>
  );
}

NumberInput.defaultProps = {
  label: "",
  errors: {},
  inputProps: {},
  leftAddonValue: null,
  rightAddonValue: null,
  leftElementValue: null,
  rightElementValue: null,
  formControlProps: {},
  value: undefined,
  defaultValue: undefined,
  onChange: (val) => val,
  setValue: () => {},
  isRequired: false,
};

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  inputProps: PropTypes.shape({}),
  leftAddonValue: PropTypes.node,
  rightAddonValue: PropTypes.node,
  leftElementValue: PropTypes.node,
  rightElementValue: PropTypes.node,
  formControlProps: PropTypes.shape({}),
  setValue: PropTypes.func,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
};
