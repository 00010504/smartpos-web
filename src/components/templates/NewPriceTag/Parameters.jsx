import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  SimpleGrid,
  FormLabel,
  FormControl,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import { sidebarsCss as css } from "./data"; /* eslint-disable react/no-children-prop */

function Parameters({
  name,
  width,
  height,
  onChange,
  onSubmit,
  isLoading,
  buttonName,
}) {
  const { t } = useTranslation();

  return (
    <Box
      borderLeft="3px solid"
      borderColor="colors.sidebarBorder"
      position="relative"
    >
      <Heading {...css.title}>{t("parameters")}</Heading>
      <SimpleGrid {...css.body}>
        <FormControl isRequired>
          <FormLabel {...css.label}>{t("label_name")}</FormLabel>
          <Input
            {...css.input}
            placeholder={t("enter_label_name")}
            type="text"
            value={name}
            onChange={(e) => onChange(e.target.value, "name")}
          />
        </FormControl>
        <SimpleGrid columns={2} gap="24px">
          <FormControl>
            <FormLabel {...css.label}>{t("width")}</FormLabel>
            <NumberInput
              min={136}
              value={width}
              onChange={(e) => onChange(+e, "width")}
            >
              <NumberInputField {...css.input} />
              <NumberInputStepper {...css.numberInputStepper}>
                <NumberIncrementStepper
                  {...css.stepper}
                  children={<ChevronUpIcon fontSize="24px" color="#fff" />}
                />
                <NumberDecrementStepper
                  {...css.stepper}
                  children={<ChevronDownIcon fontSize="24px" color="#fff" />}
                />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel {...css.label}>{t("height")}</FormLabel>
            <NumberInput
              defaultValue={180}
              min={64}
              value={height}
              onChange={(e) => onChange(+e, "height")}
            >
              <NumberInputField {...css.input} />
              <NumberInputStepper {...css.numberInputStepper}>
                <NumberIncrementStepper
                  {...css.stepper}
                  children={<ChevronUpIcon fontSize="23px" color="#fff" />}
                />
                <NumberDecrementStepper
                  {...css.stepper}
                  children={<ChevronDownIcon fontSize="23px" color="#fff" />}
                />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>
        <Button
          mt="auto"
          height="48px"
          position="absolute"
          bottom="20px"
          width="86%"
          type="submit"
          color="#fff"
          onClick={onSubmit}
          isLoading={isLoading}
        >
          {buttonName}
        </Button>
      </SimpleGrid>
    </Box>
  );
}

export default Parameters;

Parameters.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  buttonName: PropTypes.string.isRequired,
};
