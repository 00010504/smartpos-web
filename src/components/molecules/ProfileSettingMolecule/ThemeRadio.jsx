import {
  Center,
  FormControl,
  FormLabel,
  Image,
  Radio,
  RadioGroup,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import lighttheme from "@/assets/images/theme1.png";
import darktheme from "@/assets/images/theme2.png";
import systemtheme from "@/assets/images/theme3.png";

const map = {
  light: lighttheme,
  dark: darktheme,
  system: systemtheme,
};

export default function ThemeRadio({
  options,
  label,
  activeValue,
  setActiveValue,
}) {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <Wrap spacing={8}>
        {options.map((option) => (
          <WrapItem key={option.value}>
            <RadioGroup
              onChange={setActiveValue}
              value={activeValue}
              defaultValue={activeValue}
              name="interface-form"
            >
              <Image src={map[option.value]} alt="light theme" />
              <Center>
                <Radio mt={4} value={option.value}>
                  {option.label}
                </Radio>
              </Center>
            </RadioGroup>
          </WrapItem>
        ))}
      </Wrap>
    </FormControl>
  );
}

ThemeRadio.defaultProps = {
  label: "",
};

ThemeRadio.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  label: PropTypes.string,
  activeValue: PropTypes.string.isRequired,
  setActiveValue: PropTypes.func.isRequired,
};
