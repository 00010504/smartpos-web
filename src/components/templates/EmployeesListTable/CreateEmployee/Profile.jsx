import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import Input from "@/components/molecules/Input/Input";
import InputMask from "@/components/molecules/Input/InputMask";
import { inputStyles } from "./data";

function Profile({ control, errors, id }) {
  const { t } = useTranslation();

  return (
    <>
      <SectionHeader title={t("profile")} />

      <SimpleGrid columns={2} gap="32px" my={8}>
        <InputMask
          name="phone_number"
          control={control}
          errors={errors}
          label={t("phone_number")}
          inputProps={{ ...inputStyles, isDisabled: id }}
          maskProps={{
            placeholder: t("enter_your_phone_number"),
            mask: "+\\9\\98\\ 99 999-99-99",
          }}
        />
        <div />
        <Input
          name="first_name"
          control={control}
          errors={errors}
          label={`${t("first_name")}`}
          inputProps={{
            ...inputStyles,
            placeholder: t("first_name"),
            disabled: id,
          }}
        />
        <Input
          name="last_name"
          control={control}
          errors={errors}
          label={`${t("last_name")}`}
          inputProps={{
            ...inputStyles,
            placeholder: t("last_name"),
            disabled: id,
          }}
        />
        {!id && (
          <>
            <Input
              name="new_password"
              label={t("new_password")}
              control={control}
              errors={errors}
              inputProps={{
                placeholder: t("new_password"),
                ...inputStyles,
                disabled: id,
              }}
            />
            <Input
              name="confirm_password"
              label={t("confirm_password")}
              control={control}
              errors={errors}
              inputProps={{
                placeholder: t("confirm_password"),
                ...inputStyles,
                disabled: id,
              }}
            />
          </>
        )}
      </SimpleGrid>
    </>
  );
}

export default Profile;

Profile.defaultProps = {
  id: "",
};

Profile.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  id: PropTypes.string,
};
