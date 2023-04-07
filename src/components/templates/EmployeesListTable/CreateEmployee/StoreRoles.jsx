import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import Select from "@/components/molecules/Select/Select";
import { getRoles, getShops } from "@/services";
import { selectStyles, employeeStatus } from "./data";

function StoreRoles({ control, errors }) {
  const [stores, setStores] = useState([]);
  const [roles, setRoles] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getShops().then((res) => {
      const shopsSelect = res.data.map((shop) => ({
        label: shop.title,
        value: shop.id,
      }));
      setStores(shopsSelect);
    });
    getRoles().then((res) => {
      const rolesSelect = res.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));
      setRoles(rolesSelect);
    });
  }, []);

  return (
    <Box my="50px" pb="0px">
      <SectionHeader title={t("store_and_roles")} />
      <SimpleGrid columns={3} gap="32px" my={8}>
        <Select
          name="shop_id"
          label={t("store")}
          control={control}
          errors={errors}
          selectProps={{
            isMulti: true,
            menuPlacement: "top",
          }}
          styles={selectStyles}
          options={stores}
        />
        <Select
          name="role_id"
          label={t("role")}
          control={control}
          errors={errors}
          styles={selectStyles}
          options={roles}
          selectProps={{
            menuPlacement: "top",
          }}
        />
        <Select
          name="status"
          label={t("status")}
          control={control}
          errors={errors}
          styles={selectStyles}
          options={employeeStatus}
          selectProps={{
            menuPlacement: "top",
          }}
        />
      </SimpleGrid>
    </Box>
  );
}

export default StoreRoles;

StoreRoles.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
};
