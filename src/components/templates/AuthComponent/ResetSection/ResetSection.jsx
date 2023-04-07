import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Image, Text } from "@chakra-ui/react";
import { forgotPassword, setPassword, verifyCode } from "@/services";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import useToast from "@/hooks/useToast";
import BackIcon from "@/assets/images/auth/back.svg";
import ResetPhone from "./ResetPhone/ResetPhone";
import ResetOtp from "./ResetOtp/ResetOtp";
import ResetNewPassword from "./ResetNewPassword/ResetNewPassword";

// form fields and validation 🚧
const schema = createSchema({
  phone_number: "phoneWithout998",
});
const values = {
  phone_number: "",
  password: "",
  confirm_password: "",
};

function ResetSection() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useHookForm(values, schema);

  const resendOtp = () => {
    setLoading(true);
    forgotPassword({ phone_number: `+998${getValues("phone_number")}` })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((res) => {
        sessionStorage.setItem("otpToken", res.token);
      })
      .catch(() => {
        addToast({
          title: t("already_registered"),
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  const onSubmit = handleSubmit((data) => {
    /* 
      STEP 1 - send phone number, save temporal token, and go to step 2
      STEP 2 - send otp to server, save general token, and go to step 3
      STEP 3 - send new password to server, save general token, and redirect to /auth/login
    */
    if (step === 1) {
      setLoading(true);
      forgotPassword({ phone_number: `+998${data.phone_number}` })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((res) => {
          sessionStorage.setItem("otpToken", res.token);
          setStep(2);
        })
        .catch(() => {
          addToast({
            title: t("not_registered"),
            status: "error",
          });
        })
        .finally(() => setLoading(false));
    }
    if (step === 2 && otp.length === 6) {
      setLoading(true);
      verifyCode({ otp })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((res) => {
          sessionStorage.setItem("temporary_token", res.token);
          setStep(3);
        })
        .catch(() => {
          addToast({
            title: t("incorrect_code"),
            status: "error",
          });
        })
        .finally(() => setLoading(false));
    }
    if (step === 3) {
      setLoading(true);
      setPassword(
        {
          new_password: data.password,
          confirm_password: data.confirm_password,
        },
        {
          Authorization: `Bearer ${sessionStorage.getItem("temporary_token")}`,
        },
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.code >= 400) {
            throw res;
          }
        })
        .then(() => {
          addToast({
            title: t("password_changed"),
            status: "success",
          });
          const timeout = setTimeout(() => {
            clearTimeout(timeout);
            navigate("/auth/login");
          }, 3000);
        })
        .catch((err) => {
          addToast({
            title: t(err.message),
            status: "error",
          });
        })
        .finally(() => setLoading(false));
    }
  });

  return (
    <>
      {step === 1 && (
        <Text onClick={() => navigate("/auth")} {...styles.backText}>
          <Image src={BackIcon} width="9px" alt="" mt="-2px" />
          {t("back")}
        </Text>
      )}
      <form onSubmit={onSubmit}>
        {step !== 3 && (
          <ResetPhone
            control={control}
            errors={errors}
            loading={loading}
            step={step}
          />
        )}
        {step !== 3 && step === 2 && (
          <ResetOtp
            phone={getValues("phone_number")}
            step={{ value: step, onChange: setStep }}
            otp={{ value: otp, onChange: setOtp }}
            onSubmit={onSubmit}
            loading={loading}
            resendCode={resendOtp}
          />
        )}
      </form>
      {step === 3 && (
        <ResetNewPassword
          submit={onSubmit}
          setPassword={setValue}
          loading={loading}
        />
      )}
    </>
  );
}

export default ResetSection;

const styles = {
  backText: {
    position: "absolute",
    top: "36px",
    left: "60px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "gray.500",
    fontSize: "18px",
  },
};
