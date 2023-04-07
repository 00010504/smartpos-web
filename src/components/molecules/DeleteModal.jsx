import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";

function DeleteModal({
  isOpen,
  isDeleting,
  onClose,
  onDelete,
  title,
  description,
}) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent {...styles.container}>
        <ModalHeader {...styles.heading}>{title}</ModalHeader>
        <ModalBody {...styles.text}>{description}</ModalBody>
        <ModalFooter display="grid" gridTemplateColumns="1fr 1fr" gap="15px">
          <Button
            {...styles.button}
            {...styles.cancelButton}
            colorScheme="gray"
            mr={3}
            onClick={onClose}
          >
            {t("no_cancel")}
          </Button>
          <Button
            {...styles.button}
            {...styles.deleteButton}
            onClick={async () => {
              await onDelete();
              onClose();
            }}
            isLoading={isDeleting}
            colorScheme="blue"
          >
            {t("yes_delete")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;

DeleteModal.defaultProps = {
  title: "",
  description: "",
  isOpen: false,
  isDeleting: false,
};

DeleteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  isDeleting: PropTypes.bool,
};

const styles = {
  container: {
    padding: "42px 16px 20px 16px",
    textAlign: "center",
    borderRadius: "16px",
    bg: "colors.body",
  },
  heading: {
    padding: 0,
    fontSize: "28px",
    color: "colors.text",
    lineHeight: "32px",
    mb: "15px",
  },
  text: {
    fontSize: "15px",
    color: "#454545",
    marginTop: "-6px",
  },
  button: {
    height: "52px",
    fontSize: "16px",
  },
  cancelButton: {
    backgroundColor: "colors.grayF9",
  },
  deleteButton: {
    backgroundColor: "#256DF6",
    color: "#FFFFFF",
  },
};
