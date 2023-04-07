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
import Mask from "react-input-mask";
import alertIcon from "@/assets/AlertRed.svg";
import PropTypes from "prop-types";
import removePhoneChars from "@/helpers/removePhoneChars";
import { flow } from "lodash";

export default function InputMask({
  name,
  label,
  control,
  errors,
  inputProps,
  maskProps,
  leftAddonValue,
  rightAddonValue,
  leftElementValue,
  rightElementValue,
  formControlProps,
  isRequired,
}) {
  return (
    <FormControl isInvalid={!!errors[name]} {...formControlProps}>
      {label && (
        <FormLabel htmlFor={name}>
          {label}{" "}
          {isRequired && (
            <Text display="inline-block" color="red">
              *
            </Text>
          )}
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const {
            onChange,
            onBlur,
            ref,
            value: fieldValue,
            name: fieldName,
          } = field;

          const controllerProps = {
            onBlur,
            onChange: flow([removePhoneChars, onChange]),
            value: fieldValue,
            name: fieldName,
          };

          return (
            <InputGroup size="md">
              {leftAddonValue ? (
                <InputLeftAddon>{leftAddonValue}</InputLeftAddon>
              ) : null}

              {leftElementValue ? (
                <InputLeftElement pointerEvents="none">
                  {leftElementValue}
                </InputLeftElement>
              ) : null}

              <Mask maskChar={null} {...controllerProps} {...maskProps}>
                {(maskInputProps) => (
                  <ChakraInput
                    id={name}
                    ref={ref}
                    {...inputProps}
                    {...maskInputProps}
                    errorBorderColor="red.500"
                    autoComplete="off"
                  />
                )}
              </Mask>

              {rightElementValue ? (
                <InputRightElement top={1} width="3rem" cursor="pointer">
                  {rightElementValue}
                </InputRightElement>
              ) : null}

              {rightAddonValue ? (
                <InputRightAddon>{rightAddonValue}</InputRightAddon>
              ) : null}
            </InputGroup>
          );
        }}
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

InputMask.defaultProps = {
  inputProps: {},
  errors: {},
  leftAddonValue: null,
  rightAddonValue: null,
  leftElementValue: null,
  rightElementValue: null,
  formControlProps: {},
  isRequired: false,
  label: "",
};

InputMask.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  inputProps: PropTypes.shape({}),
  maskProps: PropTypes.shape({}).isRequired,
  leftAddonValue: PropTypes.node,
  rightAddonValue: PropTypes.node,
  leftElementValue: PropTypes.node,
  rightElementValue: PropTypes.node,
  formControlProps: PropTypes.shape({}),
  isRequired: PropTypes.bool,
};
