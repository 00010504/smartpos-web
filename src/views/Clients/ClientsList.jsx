import { Outlet } from "react-router-dom";
import useMatchEither from "@/hooks/useMatchEither";
import ClientsListComponent from "@/components/templates/Clients/ClientsListComponent";

export default function ClientsList() {
  const matchesEither = useMatchEither([
    "/clients/list/create-client",
    "/clients/list/edit-client/:client_id",
  ]);

  if (matchesEither) {
    return <Outlet />;
  }

  return <ClientsListComponent />;
}
