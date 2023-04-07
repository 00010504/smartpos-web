import { t } from "@/utils/i18n";

export const generateBarcodesOptions = [
  { value: true, label: t("yes") },
  { value: false, label: t("no") },
];

export const styles = {
  buttonStyles: {
    width: "100%",
    backgroundColor: "#256DF6",
    fontWeight: "500",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "10px",
  },
  inputStyles: {
    padding: "25px 18px",
    borderRadius: "10px",
    fontWeight: "500",
    backgroundColor: "colors.grayF9",
    color: "colors.text",
    _placeholder: {
      color: "#6F6F6F !important",
    },
  },
  selectStyles: {
    control: (provided) => ({
      ...provided,
      ...styles.inputStyles,
      padding: "8px",
      borderColor: "var(--ck-colors-colors-sidebarBorder) !important",
      backgroundColor: "var(--ck-colors-colors-grayF9) !important",
    }),
  },
};

export const th = [
  ["external_id", "10%"],
  ["import_name", "15%"],
  ["store", "10%"],
  ["quantity", "10%"],
  ["total", "10%"],
  ["status", "10%"],
  ["created_at", "10%"],
  ["completed_by", "10%"],
  ["actions", "10%"],
];
