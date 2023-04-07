import Breadcrumb from "@/components/atoms/Breadcrumb";
import ImportListTable from "@/components/templates/ImportListTable/ImportListTable";
import { Heading } from "@chakra-ui/react";
import { Outlet, useMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ImportList() {
  const { t } = useTranslation();
  const match = useMatch("/products/import/:temporary_route/:file_uid");
  const match2 = useMatch("/products/import/preview/:file_uid/view-only");

  if (match || match2) {
    return <Outlet />;
  }

  return (
    <>
      <Heading marginBottom={3} fontWeight="600" fontSize="28px">
        {t("import")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("products") },
          { name: t("import") },
        ]}
      />
      <ImportListTable />
    </>
  );
}

export default ImportList;
