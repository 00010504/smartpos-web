import { Outlet } from "react-router-dom";
import useMatchEither from "@/hooks/useMatchEither";
import SuppliersTable from "@/components/templates/SuppliersTable/SuppliersTable";

export default function Suppliers() {
  const matchesEither = useMatchEither([
    "/products/suppliers/create-supplier",
    "/products/suppliers/edit/:supplier_id",
  ]);

  if (matchesEither) {
    return <Outlet />;
  }

  return <SuppliersTable />;
}
