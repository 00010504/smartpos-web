import {
  Box,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { t } from "i18next";
import OtpInput from "react-otp-input";
import PropTypes from "prop-types";

export default function Otp({ onStepChange, otp, onChangeNumber, phoneNum }) {
  const backgroundColor = useColorModeValue("#f5f5f5", "#242f3d");

  return (
    <ModalContent {...styles.container}>
      <ModalHeader {...styles.header}>{t("forgot_password")}</ModalHeader>
      <ModalBody>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Text>
              Enter the code that you received on the number +999 {phoneNum}
            </Text>
            <Button variant="link" onClick={onChangeNumber}>
              {t("change_phone_number")}
            </Button>
          </Box>
          <OtpInput
            value={otp.value}
            onChange={otp.onChange}
            numInputs={6}
            inputStyle={{ ...styles.otp, backgroundColor }}
            containerStyle={{ gap: "13px" }}
          />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onStepChange} {...styles.nextButton} w="100%">
          {t("next")}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

Otp.propTypes = {
  onStepChange: PropTypes.func.isRequired,
  otp: PropTypes.exact({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,
  onChangeNumber: PropTypes.func.isRequired,
  phoneNum: PropTypes.string.isRequired,
};

const styles = {
  container: {
    rounded: "20px",
    p: 4,
    bg: "colors.sidebar",
  },
  header: {
    fontSize: "2xl",
  },
  nextButton: {
    color: "brand.400",
    size: "lg",
    colorScheme: "gray",
    w: "100%",
  },
  otp: {
    width: "50px",
    height: "70px",
    bg: "red",
    border: "none",
    borderRadius: "10px",
    fontSize: "24px",
  },
  footerText: {
    fontSize: "sm",
    color: "gray",
  },
};
