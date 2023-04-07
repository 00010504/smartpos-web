import { Outlet } from "react-router-dom";
import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import OrdersTable from "@/components/templates/SupplierOrders/SupplierOrdersTable";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import useMatchEither from "@/hooks/useMatchEither";

function Orders() {
  const matchesEither = useMatchEither([
    "/products/orders/create-order",
    "/products/orders/edit-order/:supplier_order_id",
    "/products/orders/receive-order/:supplier_order_id",
  ]);
  const { t } = useTranslation();

  if (matchesEither) {
    return <Outlet />;
  }

  return (
    <>
      <Heading fontWeight="600" fontSize="28px" mb={3}>
        {t("orders")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("products") },
          { name: t("orders") },
        ]}
      />
      <OrdersTable />
    </>
  );
}

export default Orders;
