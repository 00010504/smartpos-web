import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Fade, Heading, Text, Img, Button } from "@chakra-ui/react";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import InputMask from "@/components/molecules/Input/InputMask";
import Input from "@/components/molecules/Input/Input";
import { login } from "@/services";
import ShowPasswordIcon from "@/assets/images/auth/show-passoword.svg";
import HidePasswordIcon from "@/assets/images/auth/hide-passoword.svg";
import { useAuthContext } from "@/contexts/authContext";
import useToast from "@/hooks/useToast";

// form fields and validation 🚧
const schema = createSchema({
  password: "auth_password",
  phone_number: "phone",
});
const values = { phone_number: "+998", password: "" };

function SignSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setIsAuth } = useAuthContext();
  const { addToast } = useToast();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    login({
      phone_number: `+${data.phone_number}`,
      password: data.password,
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const error = await res.json();
        throw error;
      })
      .then((res) => {
        if (res.is_verified) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("refresh_token", res.refresh_token);
          sessionStorage.clear();
          setIsAuth(true);
          navigate("/dashboard", { replace: true });
        } else {
          sessionStorage.setItem("otpToken", res.token);
          localStorage.setItem("verify_phone", `+${data.phone_number}`);
          navigate("/auth/verify", { replace: true });
        }
      })
      .catch(() => {
        addToast({
          title: t("password_or_phone_is_wrong"),
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  });

  return (
    <Fade in>
      <Heading marginBottom={1} size="lg">
        {t("sign_in")}
      </Heading>
      <Text fontWeight={500} marginBottom={8}>
        {t("new_to_invan")}
        <Link to="/auth/register">
          <Text as="b" display="inline" marginLeft="5px" {...styles.linkStyles}>
            {t("sign_up")}
          </Text>
        </Link>
      </Text>
      <form onSubmit={onSubmit}>
        <InputMask
          name="phone_number"
          control={control}
          errors={errors}
          label={t("phone_number")}
          inputProps={styles.inputStyles}
          maskProps={{
            placeholder: t("enter_your_phone_number"),
            mask: "+\\9\\98\\ 99 999-99-99",
          }}
        />
        <Input
          name="password"
          control={control}
          errors={errors}
          label={`${t("password")}`}
          inputProps={{
            placeholder: t("enter_your_password"),
            type: showPassword ? "text" : "password",
            ...styles.inputStyles,
          }}
          formControlProps={{
            my: "5",
            marginTop: 5,
          }}
          rightElementValue={
            showPassword ? (
              <Img
                w="20px"
                h="20px"
                onClick={() => setShowPassword(!showPassword)}
                src={ShowPasswordIcon}
                alt=""
              />
            ) : (
              <Img
                w="20px"
                h="20px"
                onClick={() => setShowPassword(!showPassword)}
                src={HidePasswordIcon}
                alt=""
              />
            )
          }
        />
        <Link to="/auth/reset">
          <Text {...styles.linkStyles}>{t("forgot_password")}</Text>
        </Link>
        <Button type="submit" isLoading={loading} {...styles.buttonStyles}>
          {t("sign_in")}
        </Button>
      </form>
    </Fade>
  );
}

export default SignSection;

const styles = {
  inputStyles: {
    padding: "23px 14px",
    borderRadius: "10px",
    fontWeight: "500",
    outline: "1px solid rgba(0, 0, 0, 0.15)",
    _placeholder: {
      color: "gray.400 !important",
    },
  },
  linkStyles: {
    color: "#256DF6",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
  },
  buttonStyles: {
    width: "100%",
    backgroundColor: "#256DF6",
    fontWeight: "500",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "10px",
    padding: "24px",
    marginTop: "32px",
  },
};

export const inputStyles = {
  padding: "23px 10px",
  borderRadius: "10px",
  fontWeight: "500",
  outline: "1px solid rgba(0, 0, 0, 0.15)",
};
