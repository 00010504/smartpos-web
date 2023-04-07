import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Image, Text } from "@chakra-ui/react";
import { register, verifyCode } from "@/services";
import useToast from "@/hooks/useToast";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import BackIcon from "@/assets/images/auth/back.svg";
import RegisterPhone from "./RegisterPhone/RegisterPhone";
import RegisterOtp from "./RegisterOtp/RegisterOtp";

// form fields and validation 🚧
const schema = createSchema({ phone_number: "phoneWithout998" });
const values = { phone_number: "" };

function RegisterSection() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToast } = useToast();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useHookForm(values, schema);

  const resendOtp = () => {
    setLoading(true);
    register({ phone_number: `+998${getValues("phone_number")}` })
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
      STEP 2 - send otp to server, save general token, and redirect to /auth/create-account
    */
    if (step === 1) {
      setLoading(true);
      register({ phone_number: `+998${data.phone_number}` })
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
            title: t("already_registered"),
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
          navigate("/auth/complete");
        })
        .catch(() => {
          addToast({
            title: t("incorrect_code"),
            status: "error",
          });
        })
        .finally(() => setLoading(false));
    }
  });

  return (
    <>
      {step === 1 ? (
        <RegisterPhone
          step={{ value: step, onChange: setStep }}
          control={control}
          errors={errors}
          onSubmit={onSubmit}
          loading={loading}
        />
      ) : (
        <RegisterOtp
          phone={getValues("phone_number")}
          step={{ value: step, onChange: setStep }}
          onSubmit={onSubmit}
          otp={{ value: otp, onChange: setOtp }}
          loading={loading}
          resendCode={resendOtp}
        />
      )}
      {step === 2 && (
        <Text onClick={() => setStep(1)} {...styles.backText}>
          <Image src={BackIcon} width="9px" alt="" mt="-2px" />
          {t("back")}
        </Text>
      )}
    </>
  );
}

export default RegisterSection;

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
