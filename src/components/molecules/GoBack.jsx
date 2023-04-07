import {
  Flex,
  Heading,
  Box,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import BackIcon from "@/assets/goback.svg";
import WarningIcon from "@/assets/icons/warning.svg";

const TYPES = {
  static: "static",
  fixed: "fixed",
  sticky: "sticky",
};

const getStylesByType = (_type) => {
  if (_type === TYPES.fixed) {
    return {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      p: "25px 96px",
      bg: "colors.body",
      zIndex: "sticky",
      // shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    };
  }
  if (_type === TYPES.sticky) {
    return {
      position: "sticky",
      top: "50px",
      justifyContent: "space-between",
      alignItems: "center",
      p: "25px 0 20px 0",
      bg: "colors.body",
      zIndex: "100",
    };
  }

  return {
    justifyContent: "space-between",
    alignItems: "center",
    p: "25px 0 20px 0",
    bg: "colors.body",
  };
};

function GoBack({ type, title, rightElement, backUrl, isDirty, modal }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const stylesByType = getStylesByType(type);

  return (
    <Flex {...stylesByType} as="header">
      <Heading {...styles.title}>
        <Button
          onClick={() => (isDirty ? onOpen() : navigate(backUrl))}
          {...styles.backButton}
        >
          <Image src={BackIcon} {...styles.backIcon} /> {t("back")}
        </Button>
        {title}
      </Heading>
      <Box>{rightElement}</Box>
      {isDirty && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="20px" bg="colors.body">
            <ModalBody>
              <Box padding="20px 0" textAlign="center">
                <Image
                  margin="0 auto"
                  mb="20px"
                  width="50px"
                  src={WarningIcon}
                  alt=""
                />
                <Heading size="md" fontSize="32px" my="10px" fontWeight={600}>
                  {modal.title}
                </Heading>
                <Text>{modal.description}</Text>
                <Text color="#EB5757">{modal.description}</Text>
              </Box>
            </ModalBody>
            <ModalFooter
              pb="20px"
              display="grid"
              gridTemplateColumns="1fr 1fr"
              mt="-10px"
              gap="10px"
            >
              <Button
                height="55px"
                mr={3}
                color="brand.500"
                colorScheme="gray"
                bg="colors.grayF9"
                onClick={onClose}
              >
                {t("no_return")}
              </Button>
              <Button
                colorScheme="gray"
                bg="colors.grayF9"
                color="#EB5757"
                height="50px"
                onClick={() => navigate(backUrl)}
              >
                {t("yes_leave")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}

export default GoBack;

GoBack.defaultProps = {
  type: TYPES.static,
  rightElement: null,
  backUrl: -1,
  modal: {
    title: "",
    desciption: "",
  },
  isDirty: false,
};

GoBack.propTypes = {
  type: PropTypes.oneOf(Object.values(TYPES)),
  title: PropTypes.string.isRequired,
  rightElement: PropTypes.element,
  backUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDirty: PropTypes.bool,
  modal: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

const styles = {
  backButton: {
    display: "flex",
    alignItems: "center",
    colorScheme: "grey",
    color: "brand.500",
    pt: "2px",
    bg: "colors.grayF9",
  },
  title: {
    display: "flex",
    alignItems: "center",
    as: "h1",
    size: "md",
    gap: "20px",
  },
  backIcon: {
    width: "18px",
    alt: "go back",
    mt: "-2px",
    mr: "5px",
    ml: "-10px",
  },
};
