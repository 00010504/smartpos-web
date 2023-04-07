import getStyleVal from "@/helpers/getStyleVal";
import LocalStorage from "@/utils/LocalStorage";

export const widths = {
  select: 0.1,
  image: 0.1,
  product_name: 0.25,
  category: 0.15,
  price: 0.1,
  cost: 0.1,
  margin: 0.1,
  stock: 0.1,
};

export function getWidthsInPx(widthsInPercentage) {
  const col_widths = LocalStorage?.products_table?.col_widths ?? {};

  const hash_map = {};

  Object.entries(widthsInPercentage).forEach(([key, value]) => {
    const containerElm = document.getElementById("container");
    const containerWidth = getStyleVal(containerElm, "width").replace("px", "");
    const px = Math.round(+containerWidth * value);

    hash_map[key] = `${px}px`;
  }, {});

  return { ...hash_map, ...col_widths };
}

export const headingStyles = {
  bgColor: "colors.heading",
  px: "12px",
  fontSize: "15px",
  fontWeight: 700,
  color: "grey.800",
  h: "56px",
  textTransform: "none",
  mb: "8",
};

export const rowStyles = {
  h: "64px",
  px: "12px ",
  fontSize: "16px",
  fontWeight: "400",
  py: "12px",
};
