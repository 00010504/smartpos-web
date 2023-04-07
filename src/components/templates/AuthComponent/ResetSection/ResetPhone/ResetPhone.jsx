import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Heading,
  Button,
  Fade,
  InputLeftElement,
  InputLeftAddon,
} from "@chakra-ui/react";
import InputMask from "@/components/molecules/Input/InputMask";

function ResetPhone({ control, errors, loading, step }) {
  const { t } = useTranslation();

  return (
    <Fade in>
      <Heading className="mb-1" size="lg">
        {t("forgot_password")}
      </Heading>
      <div className="mt-6">
        <InputMask
          name="phone_number"
          label={t("enter_your_phone_number")}
          control={control}
          errors={errors}
          inputProps={styles.inputStyles}
          leftElementValue={
            <InputLeftElement top={1} width="3.48rem">
              <InputLeftAddon {...styles.addonStyles}>+998</InputLeftAddon>
            </InputLeftElement>
          }
          maskProps={{
            placeholder: "XX XXX-XX-XX",
            mask: "99 999-99-99",
            disabled: loading || step !== 1,
          }}
        />
        {step === 1 && (
          <Button
            type="submit"
            colorScheme="blue"
            className="p-6 mt-5"
            isLoading={loading}
            {...styles.buttonStyles}
          >
            {t("continue")}
          </Button>
        )}
      </div>
    </Fade>
  );
}

export default ResetPhone;

ResetPhone.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  step: PropTypes.number.isRequired,
};

const styles = {
  inputStyles: {
    padding: "23px 10px",
    paddingLeft: "22%",
    borderRadius: "10px",
    fontWeight: "500",
    outline: "1px solid rgba(0, 0, 0, 0.15)",
  },
  addonStyles: {
    height: "115%",
    marginLeft: "14px",
    borderRadius: "9px",
    fontWeight: "500",
    marginTop: "0px",
  },
  buttonStyles: {
    width: "50%",
    backgroundColor: "#256DF6",
    fontWeight: "500",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "10px",
  },
};
