import ReceiptTemplate from "@/components/templates/SettingsTemplates/ReceiptTemplate";
import { Outlet, useMatch } from "react-router-dom";

export default function ReceiptSettings() {
  const match = useMatch("settings/receipt/*");
  if (match.params["*"]) {
    return <Outlet />;
  }
  return <ReceiptTemplate />;
}
