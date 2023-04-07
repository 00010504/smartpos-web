import createSchema from "@/helpers/createSchema";
import { t } from "@/utils/i18n";

// form fields and validation 🚧
export const schema = createSchema({
  first_name: "default",
  last_name: "default",
  phone_number: "phone",
  new_password: "auth_password",
  confirm_password: "retypePassword",
  role_id: "select",
  shop_id: "multiselect",
  status: "select",
});

export const values = {
  first_name: "",
  last_name: "",
  phone_number: "+998",
  password: "",
  confirm_password: "",
  role_id: "",
  shop_id: [],
  status: "",
};

// styles
export const inputStyles = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};

export const selectStyles = {
  control: (provided) => ({
    ...provided,
    height: "54px",
    borderRadius: "10px",
    border: "1px solid var(--ck-colors-colors-sidebarBorder) !important",
  }),
};

export const employeeStatus = [
  { value: "1fe92aa8-2a61-4bf1-b907-182b497584ad", label: t("invited") },
  { value: "9fb3ada6-a73b-4b81-9295-5c1605e54552", label: t("active") },
  { value: "0adc982c-749b-4446-9d36-d136a76b99ea", label: t("rejected") },
  { value: "3e6eff54-dd23-4603-99f6-8f5fc24d19ff", label: t("blocked") },
];
