import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import RolesListTable from "@/components/templates/RolesListTable/RolesListTable";
import useMatchEither from "@/hooks/useMatchEither";

function EmployeesList() {
  const { t } = useTranslation();
  const match = useMatchEither([
    "/management/roles/create-role",
    "/management/roles/role/:role_id",
  ]);

  if (match) {
    return <Outlet />;
  }

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("roles")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("managament") },
          { name: t("roles") },
        ]}
      />
      <RolesListTable />
    </>
  );
}

export default EmployeesList;
