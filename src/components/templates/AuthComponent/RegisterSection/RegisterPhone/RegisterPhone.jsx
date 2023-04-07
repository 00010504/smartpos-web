import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Heading,
  Text,
  Button,
  Fade,
  InputLeftElement,
  InputLeftAddon,
} from "@chakra-ui/react";
import InputMask from "@/components/molecules/Input/InputMask";

function RegisterPhone({ control, errors, onSubmit, loading }) {
  const { t } = useTranslation();

  return (
    <Fade in>
      <Heading size="lg">{t("lets_create_your_account")}</Heading>
      <Text width="90%" className="text-slate-300 mt-2 mb-3">
        {t("signing_up_text")}
      </Text>
      <form onSubmit={onSubmit}>
        <InputMask
          name="phone_number"
          control={control}
          errors={errors}
          label={t("enter_your_phone_number")}
          inputProps={styles.inputStyles}
          leftElementValue={
            <InputLeftElement height="102%" top={1} width="3.48rem">
              <InputLeftAddon {...styles.addonStyles}>+998</InputLeftAddon>
            </InputLeftElement>
          }
          maskProps={{
            placeholder: "XX XXX-XX-XX",
            mask: "99 999-99-99",
          }}
        />
        <Button
          type="submit"
          className="p-6 mt-5"
          isLoading={loading}
          {...styles.buttonStyles}
        >
          {t("continue")}
        </Button>
        <Text className="mt-4 font-medium">
          {t("already_have_an_account")}
          <Link to="/auth/login">
            <span className="text-blue-600 cursor-pointer ml-1">
              {t("sign_in")}
            </span>
          </Link>
        </Text>
      </form>
    </Fade>
  );
}

export default RegisterPhone;

RegisterPhone.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
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
    height: "114%",
    marginLeft: "14px",
    borderRadius: "9px",
    fontWeight: "500",
    marginTop: "0",
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
