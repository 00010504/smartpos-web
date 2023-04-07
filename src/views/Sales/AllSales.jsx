import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import AllSalesTemplate from "@/components/templates/SalesTemplates/AllSalesTemplate";

export default function AllSales() {
  const { t } = useTranslation();

  return (
    <>
      <Heading marginBottom={3} fontWeight="600" fontSize="28px">
        {t("all_sales")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("sales") },
          { name: t("all_sales") },
        ]}
      />
      <AllSalesTemplate />
    </>
  );
}
