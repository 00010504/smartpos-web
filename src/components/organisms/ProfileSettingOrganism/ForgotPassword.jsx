import InputMask from "@/components/molecules/Input/InputMask";
import {
  Button,
  InputLeftAddon,
  InputLeftElement,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { t } from "i18next";
import PropTypes from "prop-types";

export default function ForgotPassword({ control, errors, onCheckValid }) {
  return (
    <ModalContent {...styles.container}>
      <ModalHeader {...styles.header}>{t("forgot_password")}</ModalHeader>
      <ModalBody>
        <InputMask
          name="phone_number"
          label={t("enter_your_phone_number")}
          control={control}
          errors={errors}
          inputProps={styles.input}
          maskProps={{
            placeholder: "XX XXX-XX-XX",
            mask: "99 999 99 99",
          }}
          leftElementValue={
            <InputLeftElement>
              <InputLeftAddon {...styles.addOn}>+998</InputLeftAddon>
            </InputLeftElement>
          }
        />
      </ModalBody>
      <ModalFooter>
        <Button
          form="forgot-password"
          {...styles.nextButton}
          w="100%"
          onClick={onCheckValid}
        >
          {t("next")}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

ForgotPassword.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  onCheckValid: PropTypes.func.isRequired,
};

const styles = {
  container: {
    rounded: "20px",
    p: 4,
  },
  header: {
    fontSize: "2xl",
  },
  addOn: {
    borderRadius: "9px",
    fontWeight: "500",
    h: 12,
    ml: 7,
    mt: 2,
  },
  input: {
    paddingLeft: "25%",
    borderRadius: "lg",
    fontWeight: "500",
    height: 12,
  },
  nextButton: {
    color: "brand.400",
    size: "lg",
    colorScheme: "gray",
  },
};
