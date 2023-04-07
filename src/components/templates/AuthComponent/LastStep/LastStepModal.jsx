import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useAuthContext } from "@/contexts/authContext";
import CheckIcon from "@/assets/images/create-account/check.svg";

function LastStepModal({ open }) {
  const navigate = useNavigate();
  const { setIsAuth } = useAuthContext();
  const { t } = useTranslation();

  return (
    <Modal
      isCentered
      motionPreset="slideInBottom"
      isOpen={open.value}
      onClose={() => open.onChange(false)}
    >
      <ModalOverlay />
      <ModalContent bg="colors.body" className="text-center pb-7">
        <Image
          width="50px"
          margin="40px auto 12px auto"
          src={CheckIcon}
          alt=""
        />
        <Text className="text-2xl font-bold" p={0}>
          {t("welcome_to_invan")}
        </Text>
        <ModalBody>
          <Text>{t("signing_up_text")}</Text>
        </ModalBody>

        <Button
          onClick={() => {
            setIsAuth(true);
            sessionStorage.clear();
            navigate("/dashboard", { replace: true });
          }}
          colorScheme="blue"
          {...buttonStyles}
        >
          {t("lets_start")}
        </Button>
      </ModalContent>
    </Modal>
  );
}

export default LastStepModal;

LastStepModal.propTypes = {
  open: PropTypes.exact({
    value: PropTypes.bool,
    onChange: PropTypes.func,
  }).isRequired,
};

const buttonStyles = {
  backgroundColor: "#256DF6",
  fontWeight: "500",
  color: "#fff",
  fontSize: "20px",
  borderRadius: "10px",
  padding: "24px 40px",
  margin: "0 auto",
  marginTop: "18px",
};
