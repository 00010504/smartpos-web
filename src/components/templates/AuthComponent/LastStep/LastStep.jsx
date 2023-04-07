import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fade, Heading, Button, Grid, GridItem, Img } from "@chakra-ui/react";
import ShowPasswordIcon from "@/assets/images/auth/show-passoword.svg";
import HidePasswordIcon from "@/assets/images/auth/hide-passoword.svg";
import { useTranslation } from "react-i18next";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import { createProfile } from "@/services";
import Input from "@/components/molecules/Input/Input";

// form fields and validation 🚧
const schema = createSchema({
  name: "default",
  surname: "default",
  new_password: "auth_password",
  confirm_password: "retypePassword",
});
const values = {
  new_password: "",
  confirm_password: "",
  name: "",
  surname: "",
};

function LastStep() {
  const [show, setShow] = useState({
    password: true,
    confirmPassword: true,
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    const {
      name: first_name,
      surname: last_name,
      new_password,
      confirm_password,
    } = data;
    createProfile({
      first_name,
      last_name,
      new_password,
      confirm_password,
    })
      .then((res) => {
        if (res.ok) {
          navigate("/auth/create-account");
        } else {
          throw new Error(res.message);
        }
        // navigate("/auth/create-account"); // TODO: remove this temporary line
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <Fade in>
      <Heading marginBottom={5} size="lg">
        {t("last_step")}
      </Heading>
      <form onSubmit={onSubmit}>
        <Grid gridTemplateColumns="1fr 1fr" gap="40px" marginBottom="-12px">
          <GridItem>
            <Input
              name="name"
              label={t("name")}
              control={control}
              errors={errors}
              inputProps={{
                placeholder: t("enter_your_name"),
                ...styles.inputStyles,
              }}
              formControlProps={{
                my: "5",
                marginTop: 5,
              }}
            />
          </GridItem>
          <GridItem>
            <Input
              name="surname"
              label={t("surname")}
              control={control}
              errors={errors}
              inputProps={{
                placeholder: t("enter_your_surname"),
                ...styles.inputStyles,
              }}
              formControlProps={{
                my: "5",
                marginTop: 5,
              }}
            />
          </GridItem>
        </Grid>
        <Input
          name="new_password"
          label={t("new_password")}
          control={control}
          errors={errors}
          inputProps={{
            placeholder: t("new_password"),
            type: show.password ? "password" : "text",
            ...styles.inputStyles,
          }}
          formControlProps={{
            my: "5",
            marginTop: 5,
          }}
          rightElementValue={
            !show.password ? (
              <Img
                onClick={() => setShow({ ...show, password: !show.password })}
                src={ShowPasswordIcon}
                alt=""
              />
            ) : (
              <Img
                onClick={() => setShow({ ...show, password: !show.password })}
                src={HidePasswordIcon}
                alt=""
              />
            )
          }
        />
        <Input
          name="confirm_password"
          control={control}
          errors={errors}
          label={t("confirm_password")}
          inputProps={{
            placeholder: t("confirm_password"),
            type: show.confirmPassword ? "password" : "text",
            ...styles.inputStyles,
          }}
          formControlProps={{
            marginTop: 7,
          }}
          rightElementValue={
            !show.confirmPassword ? (
              <Img
                onClick={() =>
                  setShow({ ...show, confirmPassword: !show.confirmPassword })
                }
                src={ShowPasswordIcon}
                alt=""
              />
            ) : (
              <Img
                onClick={() =>
                  setShow({ ...show, confirmPassword: !show.confirmPassword })
                }
                src={HidePasswordIcon}
                alt=""
              />
            )
          }
        />
        <Button
          type="submit"
          colorScheme="blue"
          className="p-6 mt-8"
          isLoading={isSubmitting}
          {...styles.buttonStyles}
        >
          {t("start_working")}
        </Button>
      </form>
    </Fade>
  );
}

export default LastStep;

const styles = {
  buttonStyles: {
    width: "100%",
    backgroundColor: "#256DF6",
    fontWeight: "500",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "10px",
  },
  inputStyles: {
    padding: "23px 14px",
    borderRadius: "10px",
    fontWeight: "500",
    outline: "1px solid rgba(0, 0, 0, 0.15)",
    _placeholder: {
      color: "gray.400 !important",
    },
  },
};
