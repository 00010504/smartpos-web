import { useState } from "react";
import ForgotPassword from "@/components/organisms/ProfileSettingOrganism/ForgotPassword";
import OtpModal from "@/components/organisms/ProfileSettingOrganism/Otp";
import NewPassword from "@/components/organisms/ProfileSettingOrganism/NewPassword";
import { t } from "i18next";
import { Button, Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import { forgotPassword, verifyCode } from "@/services";
import useToast from "@/hooks/useToast";

const schema = createSchema({
  phone_number: "phoneWithout998",
});
const values = {
  phone_number: "",
  new_password: "",
  confirm_password: "",
};

export default function ForgotPasswordOrganism() {
  const [step, setStep] = useState(1);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [otp, setOtp] = useState("");
  const [phoneNum, setPhoneNum]=useState("")
  const { addToast } = useToast();
  const {
    control,
    trigger,
    formState: { errors },
    handleSubmit,
    reset,
  } = useHookForm(values, schema);

  const handleStepChange = (s) => () => {
    onSubmit();
    setStep(s);
  };
  const handleClose = () => {
    onClose();
    setStep(1);
  };
  const onSubmit = handleSubmit((data) => {
    if (step === 1) {
      forgotPassword({ phone_number: `+998${data.phone_number}` })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res);
        })
        .then((res) => {
          sessionStorage.setItem("otpToken", res?.token);
          setStep(2);
        })
        .catch(() => {
          addToast({
            title: t("not_registered"),
            status: "error",
          });
        });
    }
    setPhoneNum(`${data?.phone_number}`)

    if (step === 2 && otp.length === 6) {
      verifyCode({ otp })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res);
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
        });
    }
  });

  return (
    <form onSubmit={onSubmit} id="forgot-password">
      <Button onClick={onOpen} variant="link">
        {t("forgot_old_password")}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        onCloseComplete={() => {
          reset(values);
          setOtp("")
        }}
      >
        <ModalOverlay />
        {step === 1 && (
          <ForgotPassword
            control={control}
            errors={errors}
            onCheckValid={async () => {
              const res = await trigger("phone_number");
              if (res) {
                await onSubmit();
              }
            }}
          />
        )}
        {step === 2 && (
          <OtpModal
            onStepChange={onSubmit}
            onClose={handleClose}
            phoneNum={phoneNum}
            otp={{ value: otp, onChange: setOtp }}
            onChangeNumber={handleStepChange(1)}
          />
        )}
        {step === 3 && (
          <NewPassword
            onModalClose={onClose}
            onStepChange={handleStepChange(1)}
          />
        )}
      </Modal>
    </form>
  );
}
