import DatePickerComponent from "react-date-picker";
import "./DatePicker.css";

import { Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Image,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import alertIcon from "@/assets/AlertRed.svg";

export default function DatePicker({
  name,
  label,
  control,
  errors,
  formControlProps,
  isRequired,
}) {
  return (
    <FormControl {...formControlProps} isInvalid={!!errors[name]}>
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
          <DatePickerComponent
            disableCalendar
            clearIcon={false}
            format="dd/MM/yyyy"
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yyyy"
            maxDate={new Date(2050, 0, 1)}
            {...field}
          />
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

DatePicker.defaultProps = {
  label: "",
  errors: {},
  formControlProps: {},
  labelRightElement: null,
  isRequired: false,
};

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  formControlProps: PropTypes.shape({}),
  label: PropTypes.string,
  labelRightElement: PropTypes.node,
  isRequired: PropTypes.bool,
};
