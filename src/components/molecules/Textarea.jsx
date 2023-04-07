import {
  FormControl,
  FormLabel,
  InputGroup,
  Textarea as ChakraTextarea,
  FormErrorMessage,
  Image,
} from "@chakra-ui/react";
import { t } from "i18next";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import alertIcon from "@/assets/AlertRed.svg";

export default function Textarea({
  name,
  label,
  control,
  errors,
  textAreaProps,
  formControlProps,
}) {
  return (
    <FormControl isInvalid={!!errors[name]} {...formControlProps}>
      <FormLabel htmlFor={name}>{t(label)}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputGroup>
            <ChakraTextarea
              id={name}
              bg="colors.grayF9"
              border="none"
              height="150"
              {...field}
              {...textAreaProps}
              errorBorderColor="red.500"
              autoComplete="off"
            />
          </InputGroup>
        )}
      />
      {errors[name] && (
        <FormErrorMessage p="1">
          <Image src={alertIcon} alt="alert" marginRight="5px" />
          {errors[name]?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}

Textarea.defaultProps = {
  errors: {},
  textAreaProps: {},
  formControlProps: {},
};

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  textAreaProps: PropTypes.shape({}),
  formControlProps: PropTypes.shape({}),
};
