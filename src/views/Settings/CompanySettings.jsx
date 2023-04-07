import CompanyTemplate from "@/components/templates/SettingsTemplates/CompanyTemplate";
import { Outlet, useMatch } from "react-router-dom";

export default function CompanySettings() {
  const match = useMatch("/settings/company/*");
  if (match.params["*"]) {
    return <Outlet />;
  }
  return <CompanyTemplate />;
}
