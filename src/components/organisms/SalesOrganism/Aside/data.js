import { t } from "@/utils/i18n";

export const css = {
  kdb: {
    mt: "-1px",
    as: "span",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    border: "2px solid #BDBDBD",
    color: "#BDBDBD",
    fontWeight: 700,
    pt: "2px",
    pl: "1px",
    borderRadius: "6px",
  },
  input: {
    p: "27px 16px",
    background: "colors.grayF9",
    border: "2px solid #EFF0F6",
    borderRadius: "15px",
    _placeholder: {
      color: "#BDBDBD !important",
    },
  },
};

export const clientsCss = {
  clients: {
    w: "325px",
    border: "2px solid #EFF0F6",
    borderRadius: "15px",
    position: "absolute",
    top: "110%",
    left: "-2px",
    zIndex: 1,
    bg: "colors.sidebar",
    maxHeight: "300px",
    overflowY: "auto",
  },
  deleteIcon: {
    maxHeight: "18px",
    width: "18px",
    alt: "delete",
    cursor: "pointer",
    position: "absolute",
    top: "50%",
    right: "16px",
    transform: "translateY(-50%)",
  },
  clientResultBox: {
    alignItems: "center",
    gap: "15px",
    cursor: "pointer",
    p: "10px 15px",
    mt: "-15px",
    _first: {
      mt: "0",
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px",
    },
    _last: {
      borderBottomLeftRadius: "15px",
      borderBottomRightRadius: "15px",
    },
    _hover: {
      bg: "colors.grayF9",
    },
  },
};

export const discountTypes = [
  {
    label: t("percentage"),
    value: "1fe92aa8-2a61-4bf1-b907-182b497584ad",
  },
  {
    label: t("amount"),
    value: "9fb3ada6-a73b-4b81-9295-5c1605e54552",
  },
];

// 9a2aa8fe-806e-44d7-8c9d-575fa67ebefd
