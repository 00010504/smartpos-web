import { Outlet, useMatch } from "react-router-dom";
import StoreTemplate from "@/components/templates/SettingsTemplates/StoreTemplate";

export default function StoreSettings() {
  const match = useMatch("settings/store/*");
  if (match.params["*"]) {
    return <Outlet />;
  }
  return <StoreTemplate />;
}
