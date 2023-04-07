import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heading } from "@chakra-ui/react";
import useMatchEither from "@/hooks/useMatchEither";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import EmployeesListTable from "@/components/templates/EmployeesListTable/EmployeesListTable";

function EmployeesList() {
  const match = useMatchEither([
    "/management/employees/create-employee",
    "/management/employees/edit/:emp_id",
  ]);

  const { t } = useTranslation();

  if (match) {
    return <Outlet />;
  }

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("employees")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("managament") },
          { name: t("employees") },
        ]}
      />
      <EmployeesListTable />
    </>
  );
}

export default EmployeesList;
