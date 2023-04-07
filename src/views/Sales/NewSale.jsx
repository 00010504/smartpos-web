import { Outlet, useMatch } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SelectStoreModal from "@/components/organisms/SalesOrganism/SelectStoreModal";
import Aside from "@/components/organisms/SalesOrganism/Aside/Aside";
import Footer from "@/components/organisms/SalesOrganism/Footer";
import Header from "@/components/organisms/SalesOrganism/SaleHeader";
import Main from "@/components/organisms/SalesOrganism/Main";
import NewSaleLayout from "@/layouts/NewSaleLayout";
import { createOrder } from "@/services";
import { getDefaultShiftQuery } from "@/queries";
import LocalStorage from "@/utils/LocalStorage";

export default function NewSale() {
  const childMatch = useMatch("sales/new-sale/payment");
  const queryClient = useQueryClient();

  const { data: shift, isLoading } = useQuery({
    ...getDefaultShiftQuery(),
  });

  if (!localStorage.getItem("order") && shift?.status === "open") {
    createOrder({
      cashbox_id: shift.cashbox_id.value,
    }).then((response) => {
      queryClient.removeQueries({ queryKey: ["order"] });
      LocalStorage.set("order", response);
    });
  }

  if (childMatch) {
    return <Outlet />;
  }

  return (
    <>
      {!isLoading && (!shift || shift?.status !== "open") && (
        <SelectStoreModal />
      )}
      <NewSaleLayout
        shiftLoading={isLoading}
        defaultShift={shift ?? {}}
        header={<Header shift={shift ?? {}} />}
        main={<Main />}
        aside={<Aside />}
        footer={<Footer />}
      />
    </>
  );
}
