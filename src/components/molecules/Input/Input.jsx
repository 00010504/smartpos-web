import { Controller } from "react-hook-form";
import {
  Input as ChakraInput,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  Image,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import alertIcon from "@/assets/AlertRed.svg";

export default function Input({
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
  isRequired,
}) {
  return (
    <FormControl
      {...formControlProps}
      isInvalid={!!errors[name]}
      // isRequired={isRequired}
    >
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

            <ChakraInput
              id={name}
              {...field}
              {...inputProps}
              errorBorderColor="blue"
              autoComplete="off"
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

      {errors[name] && (
        <FormErrorMessage p="1">
          <Image
            src={alertIcon}
            alt="alert"
            marginRight="6px"
            transform="translateY(-1.2px)"
          />{" "}
          {errors[name]?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

Input.defaultProps = {
  label: "",
  errors: {},
  inputProps: {},
  formControlProps: {},
  leftAddonValue: null,
  rightAddonValue: null,
  leftElementValue: null,
  rightElementValue: null,
  labelRightElement: null,
  isRequired: false,
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  inputProps: PropTypes.shape({}),
  formControlProps: PropTypes.shape({}),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  leftAddonValue: PropTypes.node,
  rightAddonValue: PropTypes.node,
  leftElementValue: PropTypes.node,
  rightElementValue: PropTypes.node,
  labelRightElement: PropTypes.node,
};
