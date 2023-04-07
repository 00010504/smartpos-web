import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button, Flex, Heading, Box, SimpleGrid, Fade } from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import Select from "@/components/molecules/Select/Select";
import Input from "@/components/molecules/Input/Input";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import useToast from "@/hooks/useToast";
import { updateCompany } from "@/services";
import { getCompanyQuery } from "@/queries";

const values = {
  name: "",
  email: "",
  legal_name: "",
  legal_address: "",
  country: "",
  zip_code: "",
  tax_payer_id: "",
  ibt: "",
};

const schema = createSchema({
  name: "default",
  // email: "email",
  // legal_name: "default",
  // legal_address: "address",
  // country: "select",
  // zip_code: "zip",
  // tax_payer_id: "default",
  // ibt: "default",
});

const countryOptions = [
  { label: "Uzbekistan", value: "Uzbekistan" },
  { label: "Unated States", value: "United States" },
];

export default function CompanyTemplate() {
  const [defaultValues, setDefaultValues] = useState(values);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: company, isFetched } = useQuery({
    ...getCompanyQuery(),
  });

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useHookForm(
    useMemo(() => defaultValues, [defaultValues]),
    schema,
  );

  useEffect(() => {
    if (company) {
      const country = countryOptions.find(
        (option) => option.value === company.country,
      );
      setDefaultValues({ ...company, country });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const onSubmitHandle = handleSubmit((data) => {
    const payload = { ...data, country: data.country.value, id: company.id };

    updateCompany(payload)
      .then(() => {
        queryClient.invalidateQueries(["company"]);
        addToast({
          title: t("changes_saved"),
          status: "success",
        });
      })
      .catch(() => addToast({ title: t("could_not_save") }));
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form id="company-update" onSubmit={onSubmitHandle}>
      <Flex justify="space-between">
        <Box>
          <Heading fontWeight="600" fontSize="28px">
            {t("company")}
          </Heading>
          <Breadcrumb
            options={[
              { href: "/", name: t("dashboard"), isLink: true },
              { name: t("settings"), isLink: false },
              { name: t("company"), isLink: false },
            ]}
            containerStyles={{ mb: "35px" }}
          />
        </Box>
        <Flex gap="24px" pt="10px">
          <Button
            color="#EB5757"
            colorScheme={!isDirty ? "gray" : "blue"}
            onClick={reset}
            disabled={!isDirty}
            {...styles.button}
          >
            {t("reset")}
          </Button>
          <Button
            color="#256DF6"
            disabled={!isDirty}
            type="submit"
            form="company-update"
            {...styles.button}
          >
            {t("save")}
          </Button>
        </Flex>
      </Flex>

      {isFetched && (
        <Fade in>
          <SimpleGrid gap="40px">
            <Box>
              <SectionHeader title="main" />
              <SimpleGrid gap="10px 30px" columns={2} mt={6}>
                <Input
                  isRequired
                  name="name"
                  control={control}
                  errors={errors}
                  label={t("business_name")}
                  inputProps={{
                    placeholder: t("enter_company_name"),
                    ...inputProps,
                  }}
                />
                <Input
                  isRequired
                  name="email"
                  control={control}
                  errors={errors}
                  label={t("email")}
                  inputProps={{
                    placeholder: t("enter_business_email"),
                    ...inputProps,
                  }}
                />
              </SimpleGrid>
            </Box>
            <Box>
              <SectionHeader title="requisites" />
              <SimpleGrid gap="24px 30px" columns={2} mt={7}>
                <Input
                  isRequired
                  name="legal_name"
                  control={control}
                  errors={errors}
                  label={t("legal_name")}
                  inputProps={{
                    placeholder: t("enter_name"),
                    ...inputProps,
                  }}
                />
                <Input
                  isRequired
                  name="legal_address"
                  control={control}
                  errors={errors}
                  label={t("legal_address")}
                  inputProps={{
                    placeholder: t("enter_address"),
                    ...inputProps,
                  }}
                />
                <Select
                  name="country"
                  control={control}
                  errors={errors}
                  label={t("country")}
                  selectProps={{
                    placeholder: t("select_country"),
                  }}
                  options={countryOptions}
                />
                <Input
                  isRequired
                  name="zip_code"
                  control={control}
                  errors={errors}
                  label={t("zip_code")}
                  inputProps={{
                    placeholder: t("enter_zip_code"),
                    ...inputProps,
                  }}
                />
              </SimpleGrid>
            </Box>

            <Box>
              <SectionHeader title="bank_account" />
              <Button
                onClick={() => navigate("/settings/company/add-bank-account")}
                {...addButton}
              >
                {t("add_bank_account")}
              </Button>
              <SimpleGrid gap="10px 30px" columns={2} mt={6}>
                <Input
                  isRequired
                  name="tax_payer_id"
                  control={control}
                  errors={errors}
                  label={t("tiin")}
                  inputProps={{
                    placeholder: t("enter_tin"),
                    ...inputProps,
                  }}
                />
                <Input
                  isRequired
                  name="ibt"
                  control={control}
                  errors={errors}
                  label={t("ibt")}
                  inputProps={{
                    placeholder: t("enter_ibt"),
                    ...inputProps,
                  }}
                />
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </Fade>
      )}
    </form>
  );
}

const addButton = {
  w: "100%",
  colorScheme: "gray",
  height: "50px",
  bg: "colors.grayF9",
  color: "#256DF6",
  my: 2,
};

const inputProps = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};

const styles = {
  button: {
    width: 110,
    colorScheme: "gray",
    height: "45px",
  },
};
