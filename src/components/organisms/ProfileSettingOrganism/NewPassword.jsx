import Input from "@/components/molecules/Input/Input";
import {
  Button,
  HStack,
  Image,
  ModalContent,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { t } from "i18next";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import useToast from "@/hooks/useToast";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { setPassword } from "@/services";
import showPasswordIcon from "@/assets/images/auth/show-passoword.svg";
import hidePasswordIcon from "@/assets/images/auth/hide-passoword.svg";
import Drawer from "../../molecules/Drawer";

const values = {
  new_password: "",
  confirm_password: "",
};
const schema = createSchema({
  // new_password: "auth_password",
  // confirm_password: "retypePassword",
});

export default function NewPassword({ onModalClose, onStepChange }) {
  const [isNewPasswordShow, setNewPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToast } = useToast();
  const {
    control,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useHookForm(values, schema);

  const onSubmitHandle = handleSubmit((data) => {
    setPassword(
      {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Succes") {
          addToast({
            title: t("password_changed_successfully"),
            status: "success",
          });
        }
        onModalClose();
      });
    onClose();
    onModalClose();
    onStepChange();
  });

  useEffect(() => onOpen(), [onOpen]);

  const handleClose = async () => {
    const onCheckValid = await trigger();
    if (onCheckValid) {
      onClose();
      onModalClose();
      onStepChange();
    }
  };

  return (
    <ModalContent>
      <Drawer
        isOpen={isOpen}
        onClose={handleClose}
        Header={t("new_password")}
        Body={
          <form id="reset-password" onSubmit={onSubmitHandle}>
            <VStack spacing={4}>
              <Input
                control={control}
                errors={errors}
                name="new_password"
                label={t("new_password")}
                inputProps={{
                  ...styles.input,
                  placeholder: t("enter_new_password"),
                  type: isNewPasswordShow ? "text" : "password",
                }}
                rightElementValue={
                  <Image
                    src={
                      isNewPasswordShow ? showPasswordIcon : hidePasswordIcon
                    }
                    onClick={() => setNewPasswordShow(!isNewPasswordShow)}
                  />
                }
              />
              <Input
                control={control}
                errors={errors}
                name="confirm_password"
                label={t("confirm_password")}
                inputProps={{
                  ...styles.input,
                  placeholder: t("enter_password"),
                  type: isConfirmPasswordShow ? "text" : "password",
                }}
                rightElementValue={
                  <Image
                    src={
                      isConfirmPasswordShow
                        ? showPasswordIcon
                        : hidePasswordIcon
                    }
                    onClick={() =>
                      setConfirmPasswordShow(!isConfirmPasswordShow)
                    }
                  />
                }
              />
            </VStack>
          </form>
        }
        Footer={
          <HStack spacing={4} align="stretch" w="100%">
            <Button {...styles.btn}>{t("reset")}</Button>
            <Button type="submit" form="reset-password" {...styles.btn}>
              {t("apply")}
            </Button>
          </HStack>
        }
      />
    </ModalContent>
  );
}

NewPassword.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  onStepChange: PropTypes.func.isRequired,
};

const styles = {
  input: {
    size: "lg",
    rounded: "lg",
  },
  btn: {
    w: "100%",
    size: "lg",
    colorScheme: "gray",
    color: "brand.500",
  },
};
