import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  FormControl,
  SimpleGrid,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { pCSS, commonCSS } from "./data";

function Parameters({ buttonName, isLoading, onSubmit, state, onChange }) {
  const { t } = useTranslation();

  return (
    <Box {...commonCSS.wrapper} minH="480px">
      <Heading {...commonCSS.heading}>{t("receipt_parameters")}</Heading>
      <SimpleGrid gap="20px">
        <FormControl>
          <FormLabel fontSize="15px">{t("receipt_name")}</FormLabel>
          <Input
            value={state.name}
            onChange={(e) => onChange(e.target.value, "name")}
            placeholder={t("enter_name")}
            {...pCSS.input}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="15px">{t("display_text")}</FormLabel>
          <Input
            value={state.message}
            onChange={(e) => onChange(e.target.value, "message")}
            placeholder={t("enter_text_to_display")}
            {...pCSS.input}
          />
        </FormControl>
      </SimpleGrid>
      <Button onClick={onSubmit} isLoading={isLoading} {...pCSS.button}>
        {buttonName}
      </Button>
    </Box>
  );
}

export default Parameters;

Parameters.propTypes = {
  state: PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  buttonName: PropTypes.string.isRequired,
};
