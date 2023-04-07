import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Heading,
  Text,
  FormControl,
  Button,
  Fade,
  useColorModeValue,
} from "@chakra-ui/react";
import OtpInput from "react-otp-input";
import PropTypes from "prop-types";

function RegisterOtp({ step, phone, onSubmit, otp, loading, resendCode }) {
  const [timer, setTimer] = useState(59);
  const { t } = useTranslation();
  const backgroundColor = useColorModeValue("#f5f5f5", "#242f3d");

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => {
        setTimer((currTimer) => currTimer - 1);
        clearTimeout(timeout);
      }, 1000);
    }
  }, [timer]);

  // back to phone number step
  const backStep = () => {
    step.onChange(1);
    otp.onChange("");
  };

  // resend otp code
  const resendOtp = () => {
    otp.onChange("");
    resendCode();
    if (timer === 0) {
      setTimer(59);
    }
  };

  return (
    <Fade in>
      <Heading className="mb-1" size="lg">
        {t("enter_code")}
      </Heading>
      <form onSubmit={onSubmit}>
        <Text className="mt-5">
          {t("enter_code_that_you_received")} <br /> +998 {phone}
          <span
            aria-hidden="true"
            className="text-blue-600 cursor-pointer ml-2"
            onClick={backStep}
          >
            {t("change_number")}
          </span>
        </Text>
        <FormControl className="mt-5 flex gap-4">
          <OtpInput
            value={otp.value}
            onChange={(e) => otp.onChange(e)}
            numInputs={6}
            inputStyle={{ ...styles.otpStyles, backgroundColor }}
            containerStyle={{ gap: "20px" }}
            focusStyle={{ outline: "none" }}
          />
        </FormControl>
        <Text className="text-slate-400 mt-7">
          <span
            aria-hidden="true"
            className={
              timer > 0 ? "text-slate-400" : "text-blue-500 cursor-pointer"
            }
            onClick={resendOtp}
          >
            {t("didnt_receive_a_code")}
          </span>
          <br />
          {timer > 0 && (
            <span>
              {t("we_can_resend_sms")}{" "}
              {`0:${timer >= 10 ? timer : `0${timer}`} `}
              {t("seconds")}
            </span>
          )}
        </Text>
        <Button
          type="submit"
          onClick={onSubmit}
          colorScheme="blue"
          isLoading={loading}
          {...styles.buttonStyles}
          className="p-6 mt-6"
        >
          {t("create_account")}
        </Button>
      </form>
    </Fade>
  );
}

export default RegisterOtp;

RegisterOtp.propTypes = {
  phone: PropTypes.string.isRequired,
  step: PropTypes.exact({
    value: PropTypes.number,
    onChange: PropTypes.func,
  }).isRequired,
  otp: PropTypes.exact({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  resendCode: PropTypes.func.isRequired,
};

const styles = {
  otpStyles: {
    border: "none",
    width: "56px",
    borderRadius: "10px",
    height: "70px",
    fontWeight: "600",
    fontSize: "25px",
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
