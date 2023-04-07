import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ProductsTable from "@/components/templates/ProductsTable/ProductsTable";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import ProductsStatistics from "@/components/templates/ProductsStatistics/ProductsStatistics";
import ProductView from "@/components/organisms/ProductView/ProductView";
import useMatchEither from "@/hooks/useMatchEither";

function Catalog() {
  const [showStatistics, setShowStatistics] = useState(false);
  const [productId, setProductId] = useState("");
  const { t } = useTranslation();

  const matchesEither = useMatchEither([
    "/products/catalog/create-product",
    "/products/catalog/edit/:product_id",
  ]);

  if (matchesEither) {
    return <Outlet />;
  }

  return (
    <>
      <ProductView id={productId} onClose={() => setProductId("")} />
      <Flex
        gap={0}
        justifyContent="space-between"
        alignItems="center"
        marginBottom="-8px"
      >
        <Heading marginBottom={3} fontWeight="600" fontSize="28px">
          {t("products")}
        </Heading>
        <Text
          color="#757575"
          cursor="pointer"
          onClick={() => setShowStatistics(!showStatistics)}
        >
          {showStatistics ? t("hide_statistics") : t("show_statistics")}
        </Text>
      </Flex>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("products") },
          { name: t("catalog") },
        ]}
        containerStyles={{
          marginTop: "8px",
          marginBottom: "35px",
        }}
      />
      <Collapse in={showStatistics} animateOpacity>
        <ProductsStatistics showStatistics={showStatistics} />
      </Collapse>
      <ProductsTable setProductView={setProductId} />
    </>
  );
}

export default Catalog;
