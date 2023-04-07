import LocalStorage from "@/utils/LocalStorage";

export const getOrder = () => LocalStorage.order ?? {};

export const productStyles = {
  wrapperMotion: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  },
  container: {
    bg: "colors.grayF9",
    direction: "row",
    p: 4,
    gap: 4,
    borderRadius: "xl",
    alignItems: "center",
  },
  buttonsWrapper: {
    gap: 2,
    alignItems: "center",
    mr: "10px",
  },
  buttonStyles: {
    colorScheme: "white",
    border: "2px solid",
    borderColor: "colors.greyD9",
    width: "30px",
    bg: "colors.sidebar",
    _active: {
      transform: "scale(0.95)",
    },
  },
  countText: {
    textAlign: "center",
    minWidth: "30px",
    fontWeight: 600,
    fontSize: "20px",
    m: "0 6px",
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "auto",
    borderRadius: "10px",
    marginTop: "-5px",
    minWidth: "60px",
  },
  productName: {
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "xl",
    lineHeight: "1.1",
    mb: "5px",
  },
  pricesWrapper: {
    direction: "column",
    alignItems: "flex-end",
    width: "22%",
    position: "relative",
  },
  mxikCode: {
    color: "grey.800",
    fontWeight: "bold",
    fontSize: "lg",
  },
  price: {
    color: "brand.600",
    fontWeight: "bold",
    fontSize: "lg",
  },
  totalPrice: {
    color: "grey.800",
    fontWeight: "500",
    fontSize: "13px",
  },
  mainFlex: {
    gap: "20px",
    flexGrow: 1,
    alignItems: "center",
  },
  modalImageAndNameGrid: {
    gridTemplateColumns: "100px auto",
    gap: "20px",
    alignItems: "center",
  },
  modalImageWrapper: {
    borderRadius: "24px",
    p: "5px",
    width: "100px",
    height: "100px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  modalContent: {
    borderRadius: "32px",
    p: "24px 14px",
    bg: "colors.heading",
  },
  modalProductName: {
    width: "200px",
    fontWeight: 500,
    fontSize: "17px",
  },
  modalPrice: {
    bg: "colors.formBorder",
    borderRadius: "10px",
    p: "18px 15px",
    fontWeight: 500,
  },
  modalChangeValueGrid: {
    gridTemplateColumns: "56px auto 56px",
    gap: "18px",
  },
  modalPriceCenter: {
    bg: "colors.grayF9",
    borderRadius: "10px",
  },
  modalInput: {
    width: "80px",
    border: "none",
    fontWeight: 600,
    type: "number",
    _focus: {
      border: "none",
      boxShadow: "none",
    },
  },
  modalBottomGrid: {
    columns: 2,
    gap: "30px",
    alignItems: "center",
    mt: 3,
  },
  modalTotalPrice: {
    fontSize: "20px",
    color: "#454545",
    justifyContent: "space-between",
    fontWeight: 600,
  },
  discount: {
    position: "absolute",
    top: "-15px",
    right: "0",
    fontSize: "12px",
    textDecoration: "line-through",
    textDecorationColor: "red",
  },
};
