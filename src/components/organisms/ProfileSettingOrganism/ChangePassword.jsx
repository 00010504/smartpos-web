import { useState } from "react";
import Input from "@/components/molecules/Input/Input";
import Drawer from "@/components/molecules/Drawer";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import useLatestClosure from "@/hooks/useLatestClosure";
import useToast from "@/hooks/useToast";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { t } from "i18next";
import { updatePassword } from "@/services";
import { flow } from "lodash";
import showPasswordIcon from "@/assets/images/auth/show-passoword.svg";
import hidePasswordIcon from "@/assets/images/auth/hide-passoword.svg";
import ForgotPasswordOrganism from "./ForgotPasswordOrganism";

const values = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};
const schema = createSchema({
  old_password: "default",
  new_password: "auth_password",
  confirm_password: "retypePassword",
});

export default function ChangePassword() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOldPasswordShow, setOldPasswordShow] = useState(false);
  const [isNewPasswordShow, setNewPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const { addToast } = useToast();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useHookForm(values, schema);

  const stopPropagation = (e) => {
    e.stopPropagation();
    return e;
  };

  const onSubmitHandle = useLatestClosure(
    handleSubmit(async (data) => {
      await updatePassword(data)
        .then(() => {
          addToast({
            title: t("password_changed_successfully"),
            status: "success",
          });
          onClose();
        })
        .catch((err) => {
          if (err.data.code === 401) {
            addToast({
              title: t("old_password_incorrect"),
            });
          }
        });
    }),
  );

  return (
    <>
      <Button
        height="50px"
        bg="colors.grayF9"
        {...styles.goButton}
        onClick={onOpen}
      >
        {t("change_password")}
      </Button>
      <Drawer
        onCloseComplete={() => reset(values)}
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading>{t("security")}</Heading>}
        Body={
          <>
            <form
              onSubmit={flow(stopPropagation, onSubmitHandle)}
              id="security-form"
            >
              <Flex direction="column" height="100%" gap={6}>
                <Box>
                  <Input
                    name="old_password"
                    label={t("old_password")}
                    inputProps={{
                      placeholder: t("enter_password"),
                      type: isOldPasswordShow ? "text" : "password",
                      ...styles.input,
                    }}
                    control={control}
                    errors={errors}
                    formControlProps={{ py: 4 }}
                    rightElementValue={
                      !isOldPasswordShow ? (
                        <Image
                          src={hidePasswordIcon}
                          alt="hide password"
                          onClick={() => {
                            setOldPasswordShow(!isOldPasswordShow);
                          }}
                        />
                      ) : (
                        <Image
                          src={showPasswordIcon}
                          alt="show password"
                          onClick={() => {
                            setOldPasswordShow(!isOldPasswordShow);
                          }}
                        />
                      )
                    }
                  />
                  <Input
                    name="new_password"
                    label={t("new_password")}
                    inputProps={{
                      placeholder: t("enter_password"),
                      type: isNewPasswordShow ? "text" : "password",
                      ...styles.input,
                    }}
                    control={control}
                    errors={errors}
                    formControlProps={{ py: 4 }}
                    rightElementValue={
                      !isNewPasswordShow ? (
                        <Image
                          src={hidePasswordIcon}
                          alt="hide password"
                          onClick={() => {
                            setNewPasswordShow(!isNewPasswordShow);
                          }}
                        />
                      ) : (
                        <Image
                          src={showPasswordIcon}
                          alt="show password"
                          onClick={() => {
                            setNewPasswordShow(!isNewPasswordShow);
                          }}
                        />
                      )
                    }
                  />
                  <Input
                    name="confirm_password"
                    label={t("confirm_password")}
                    inputProps={{
                      placeholder: t("enter_password"),
                      type: isConfirmPasswordShow ? "text" : "password",
                      ...styles.input,
                    }}
                    control={control}
                    errors={errors}
                    formControlProps={{ py: 4 }}
                    rightElementValue={
                      !isConfirmPasswordShow ? (
                        <Image
                          src={hidePasswordIcon}
                          alt="hide password"
                          onClick={() => {
                            setConfirmPasswordShow(!isConfirmPasswordShow);
                          }}
                        />
                      ) : (
                        <Image
                          src={showPasswordIcon}
                          alt="show password"
                          onClick={() => {
                            setConfirmPasswordShow(!isConfirmPasswordShow);
                          }}
                        />
                      )
                    }
                  />
                </Box>
              </Flex>
            </form>
            <ForgotPasswordOrganism />
          </>
        }
        Footer={
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            gap="20px"
          >
            <Button
              onClick={() => reset(values)}
              {...styles.saveButton}
              color="red"
            >
              {t("reset")}
            </Button>
            <Button
              type="submit"
              form="security-form"
              {...styles.saveButton}
              isLoading={isSubmitting}
            >
              {t("apply")}
            </Button>
          </Box>
        }
      />
    </>
  );
}

const styles = {
  goButton: {
    color: "brand.500",
    colorScheme: "gray",
    w: "xs",
    size: "lg",
  },
  saveButton: {
    w: "48%",
    colorScheme: "gray",
    color: "brand.400",
    height: "50px",
    // bg: "colors.grayF9",
  },
  input: {
    size: "lg",
    rounded: "lg",
  },
};
