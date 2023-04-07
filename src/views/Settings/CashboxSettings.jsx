import { Outlet, useMatch } from "react-router-dom";
import CashboxTemplate from "@/components/templates/SettingsTemplates/CashboxTemplate";

export default function CashboxSettings() {
  const match = useMatch("settings/cashbox/*");

  if (match.params["*"]) {
    return <Outlet />;
  }

  return <CashboxTemplate />;
}
