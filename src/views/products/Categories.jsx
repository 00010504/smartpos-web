import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CategoriesListComponent from "@/components/templates/CategoriesList/CategoriesList";
import Breadcrumb from "@/components/atoms/Breadcrumb";

function CategoriesList() {
  const { t } = useTranslation();

  return (
    <>
      <Heading fontWeight="600" fontSize="28px" mb={3}>
        {t("categories")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("products") },
          { name: t("categories") },
        ]}
      />
      <CategoriesListComponent />
    </>
  );
}

export default CategoriesList;
