import { Fade, Heading, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import Input from "@/components/molecules/Input/Input";

// form fields and validation 🚧
const schema = createSchema({
  new_password: "auth_password",
  confirm_password: "retypePassword",
});
const values = { new_password: "", confirm_password: "" };

function ResetNewPassword({ submit, setPassword, loading }) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    setPassword("password", data.new_password);
    setPassword("confirm_password", data.confirm_password);
    submit();
  });

  return (
    <Fade in>
      <Heading marginBottom={8} size="lg">
        {t("new_password")}
      </Heading>
      <form onSubmit={onSubmit}>
        <Input
          name="new_password"
          label={t("new_password")}
          control={control}
          errors={errors}
          formControlProps={{
            marginBottom: 4,
            marginTop: 6,
          }}
          inputProps={{
            placeholder: t("new_password"),
            ...styles.inputStyles,
          }}
        />
        <Input
          name="confirm_password"
          label={t("confirm_password")}
          control={control}
          errors={errors}
          formControlProps={{
            marginTop: 7,
          }}
          inputProps={{
            placeholder: t("confirm_password"),
            ...styles.inputStyles,
          }}
        />
        <Button
          type="submit"
          colorScheme="blue"
          className="p-6 mt-8"
          isLoading={loading}
          {...styles.buttonStyles}
        >
          {t("finish")}
        </Button>
      </form>
    </Fade>
  );
}

export default ResetNewPassword;

ResetNewPassword.propTypes = {
  submit: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const styles = {
  buttonStyles: {
    width: "100%",
    backgroundColor: "#256DF6",
    fontWeight: "500",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "10px",
  },
  inputStyles: {
    padding: "23px 10px",
    borderRadius: "10px",
    fontWeight: "500",
    outline: "1px solid rgba(0, 0, 0, 0.15)",
  },
};
