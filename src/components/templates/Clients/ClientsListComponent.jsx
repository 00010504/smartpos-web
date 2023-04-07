import { Outlet, useMatch } from "react-router-dom";
import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import ClientsTable from "../ClientsTable/ClientsTable";

export default function ClientsListComponent() {
  const { t } = useTranslation();
  const childMatch = useMatch("clients/list/create-client");

  if (childMatch) {
    return <Outlet />;
  }

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("clients")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("clients") },
          { name: t("list") },
        ]}
        containerStyles={{ mb: 0 }}
      />
      <ClientsTable />
    </>
  );
}
