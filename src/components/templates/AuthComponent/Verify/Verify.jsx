import { useState } from "react";
import OtpInput from "react-otp-input";
import { useTranslation } from "react-i18next";
import {
  Heading,
  Text,
  FormControl,
  Button,
  Fade,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BackIcon from "@/assets/images/auth/back.svg";
import { verifyCode } from "@/services";
import useToast from "@/hooks/useToast";
import { useAuthContext } from "@/contexts/authContext";

function Verify() {
  const [otp, setOtp] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backgroundColor = useColorModeValue("#f5f5f5", "#242f3d");
  const { addToast } = useToast();
  const [loading, setLoading] = useState();
  const { setIsAuth } = useAuthContext();

  const onSubmit = () => {
    setLoading(true);
    verifyCode({ otp })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((res) => {
        localStorage.setItem("token", res.token);
        sessionStorage.clear();
        setIsAuth(true);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        addToast({
          title: t("incorrect_code"),
          status: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fade in>
      <Text onClick={() => navigate("/auth")} {...styles.backText}>
        <Image src={BackIcon} width="9px" alt="" mt="-2px" />
        {t("back")}
      </Text>
      <Heading className="mb-1" size="lg">
        {t("verify_account")}
      </Heading>
      <Text className="mt-5">
        {t("enter_code_that_you_received")} <br />{" "}
        {localStorage.getItem("verify_phone")}
      </Text>
      <FormControl className="mt-5 flex gap-4">
        <OtpInput
          value={otp}
          onChange={(e) => setOtp(e)}
          numInputs={6}
          inputStyle={{ ...styles.otpStyles, backgroundColor }}
          containerStyle={{ gap: "20px" }}
          focusStyle={{ outline: "none" }}
        />
      </FormControl>
      <Button
        onClick={onSubmit}
        isLoading={loading}
        colorScheme="blue"
        className="p-6 mt-6"
        {...styles.buttonStyles}
      >
        {t("verify")}
      </Button>
    </Fade>
  );
}

export default Verify;

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
