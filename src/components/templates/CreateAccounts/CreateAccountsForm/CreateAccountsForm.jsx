import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, GridItem, Button } from "@chakra-ui/react";
import useToast from "@/hooks/useToast";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import Input from "@/components/molecules/Input/Input";
import Select from "@/components/molecules/Select/Select";
import { useLangContext } from "@/contexts/langContext";

import {
  initializeCompany,
  getCompanyTypes,
  getCompanySizes,
} from "@/services";
import LastStepModal from "../../AuthComponent/LastStep/LastStepModal";
// form fields and validation 🚧
const schema = createSchema({
  business_name: "default",
  type: "select",
  business_size: "select",
});
const values = { business_name: "", type: null, business_size: null };

function CreateAccountsForm() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companySizes, setCompanySizes] = useState([]);
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { lang } = useLangContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    initializeCompany({
      name: `${data.business_name}`,
      company_type_id: data.type.value,
      company_size_id: data.business_size.value,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res.status;
      })
      .then((res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("refresh_token", res.refresh_token);
        setOpenModal(true);
      })
      .catch((status) => {
        if (status === 500) {
          addToast({
            title: t("already_registered"),
            status: "error",
          });
        } else {
          addToast({
            title: t("company_could_not_be_created"),
            status: "error",
          });
        }
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    getCompanyTypes()
      .then((res) => res.json())
      .then((res) => {
        const options = res.data.map((item) => ({
          label: item.name[lang],
          value: item.id,
        }));
        setCompanyTypes(options);
      });
    getCompanySizes()
      .then((res) => res.json())
      .then((res) => {
        const options = res.data.map((item) => ({
          label: item.name[lang],
          value: item.id,
        }));
        setCompanySizes(options);
      });
  }, [lang]);

  return (
    <form onSubmit={onSubmit}>
      <Box marginTop="40px">
        <Grid
          gridTemplateColumns="1fr 1fr"
          gridGap="0 40px"
          className="text-left"
        >
          <GridItem>
            <Input
              name="business_name"
              control={control}
              errors={errors}
              label={t("enter_business_name")}
              inputProps={{
                placeholder: t("enter_business_name"),
                ...styles.inputStyles,
              }}
              formControlProps={{
                my: "5",
                marginTop: "25px",
              }}
            />
          </GridItem>
          <GridItem marginTop="23px">
            <Select
              name="type"
              label={t("type")}
              control={control}
              errors={errors}
              selectProps={{
                placeholder: t("select"),
                height: "54px",
                outline: "1px solid rgba(0, 0, 0, 0.15)",
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: "54px",
                  outline: "1px solid rgba(0, 0, 0, 0.15)",
                }),
              }}
              options={companyTypes}
            />
          </GridItem>
          <GridItem marginTop={2}>
            <Select
              name="business_size"
              control={control}
              errors={errors}
              label={t("business_size")}
              selectProps={{
                placeholder: t("select"),
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: "54px",
                  outline: "1px solid rgba(0, 0, 0, 0.15)",
                }),
                indicatorSeparator: () => ({ display: "none" }),
              }}
              options={companySizes}
            />
          </GridItem>
        </Grid>
        <Button
          isLoading={loading}
          type="submit"
          colorScheme="blue"
          {...styles.buttonStyles}
        >
          {t("finish_setup")}
        </Button>
      </Box>
      <LastStepModal open={{ value: openModal, onChange: setOpenModal }} />
    </form>
  );
}

export default CreateAccountsForm;

const styles = {
  inputStyles: {
    padding: "25px 10px",
    outline: "1px solid rgba(0, 0, 0, 0.15)",
  },
  buttonStyles: {
    backgroundColor: "#256DF6",
    fontWeight: "500",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "10px",
    padding: "28px 40px",
    marginTop: "3rem",
  },
};
