import createSchema from "@/helpers/createSchema";
import { t } from "@/utils/i18n";
import { cloneDeep, range } from "lodash";
import { createRef } from "react";
import SingleWorker from "@/classes/SingleWorker";
import { createProduct, updateProduct } from "@/services";
import genSelectOption from "@/helpers/genSelectOptions";

const worker = SingleWorker.getInstance();

// schema and initialValues
export const schema = createSchema({
  sku: "default",
  name: "default",
  measurement_unit_id: "select",
  // barcode: "default",
  // mxik_code: "mxik_code",
  // category: "select",
  // measurement_unit_id: "select",
  // shop_prices: "pricesArr",
});

export const initialValues = {
  product_type_id: "8b0bf29c-58e8-4310-8bb1-a1b9771f9c47",
  barcode: "",
  sku: "",
  name: "",
  measurement_unit_id: [],
  mxik_code: "",
  category_id: "",
  is_marking: true,
  description: "",
  tags: [],
  images: [],
  brand_id: "",
  measurement_values: [],
  shop_prices: [],
};

const problematicEntries = [
  { entryName: "shop_prices", childEntries: ["supply_price", "retail_price"] },
  { entryName: "measurement_values", childEntries: ["small_left", "amount"] },
];

export const ACTIONS = {
  SET_VALUES: "SET_VALUES",
};

export function formReducer(state, action) {
  const clonedState = cloneDeep(state);
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_VALUES: {
      const { product, shops } = payload;

      const initialPrices = shops?.data?.map(getInitialPrices) ?? [];
      const initialRemains = shops?.data?.map(getInitialRemains) ?? [];
      let category_id;

      if (product) {
        let clonedProduct = cloneDeep(product);

        const measurement_unit_id = genSelectOption(
          clonedProduct.measurement_unit,
          {
            valuePath: "id",
            labelPath: "long_name",
          },
        );

        if (clonedProduct.categories[0]) {
          category_id = genSelectOption(clonedProduct.categories[0], {
            valuePath: "id",
            labelPath: "name",
          });
        }

        clonedProduct = convertTo("str", clonedProduct);

        clonedProduct.measurement_values = initialRemains.map((item) => {
          const found = clonedProduct.measurement_values.find(
            ({ shop_id }) => shop_id === item.shop_id,
          );
          return Object.assign(item, found);
        });

        clonedProduct.shop_prices = initialPrices.map((item) => {
          const found = clonedProduct.shop_prices.find(
            ({ shop_id }) => shop_id === item.shop_id,
          );
          return Object.assign(item, found);
        });

        clonedProduct.measurement_unit_id = measurement_unit_id || "";
        clonedProduct.category_id = category_id || "";
        clonedProduct.barcode = clonedProduct?.barcodes[0];
        clonedProduct.shop_prices = formatInitialMargin(
          clonedProduct.shop_prices,
        );

        problematicEntries.forEach(({ entryName }) => {
          clonedProduct[entryName] = concat.apply(clonedProduct, [
            entryName,
            shops.data,
          ]);
        });

        return clonedProduct;
      }

      clonedState.shop_prices = initialPrices;
      clonedState.measurement_values = initialRemains;

      return clonedState;
    }
    default: {
      return state;
    }
  }
}

export const typesOptions = [
  { label: t("product"), value: "8b0bf29c-58e8-4310-8bb1-a1b9771f9c47" },
  { label: t("service"), value: "2b98f424-91c9-46cc-abd7-c888208807da" },
  { label: t("set"), value: "a19a514e-41c9-4666-a01a-e3f9c0255609" },
];

export const markingOptions = [
  {
    label: t("yes"),
    value: true,
  },
  {
    label: t("no"),
    value: false,
  },
];

const sections = ["main", "price", "remains"];
const currentHash = window.location.hash.slice(1) || "main";

export const refs = range(sections.length).map(() => createRef());
export const currentHashIdx = sections.findIndex(
  (section) => section === currentHash,
);

// styles
export const styles = {
  container: {
    paddingX: "60px",
    pb: "40px",
    marginTop: "6rem",
  },
};

export const inputStyles = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};

export const buttonStyles = {
  margin: "25px 0",
  height: "45px",
  padding: "20px 30px",
  borderRadius: "10px",
  fontSize: "16px",
  color: "#256DF6",
  fontWeight: "500",
  backgroundColor: "colors.grayF9",
  width: "100%",
  marginBottom: 0,
};

export const tableStyles = {
  td: {
    color: "colors.text",
    fontSize: "14px",
    borderBottom: "none",
    bg: "none !important",
  },
  th: {
    borderBottom: "1px solid #D9D9D9",
    fontSize: "14px",
    textTransform: "none",
    fontWeight: "500",
    height: "60px",
  },
  input: {
    // transform: "translateY(-2px)",
    // border: "1px solid #D9D9D9",
    // padding: "13px",
    // width: "100%",
    // position: "relative",
    placeholder: 0,
  },
  rightText: {
    color: "#D9D9D9",
    position: "absolute",
    right: "10px",
    top: "13%",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#fff",
    width: "fit-content",
  },
};

// data and options
export const priceTableHeaders = [
  {
    label: "store",
    value: "store_name",
    width: "50px",
  },
  {
    label: "supply_price",
    value: "supply_price",
    width: "200px",
  },
  {
    label: "margin",
    value: "margin",
    width: "150px",
  },
  {
    label: "retail_price",
    value: "retail_price",
    width: "250px",
  },
];

export const unitTypesOptions = [
  { label: "Per Product", value: "per" },
  { label: "Per Weight", value: "weight" },
  { label: "Per Liter", value: "liter" },
  { label: "Per Meter", value: "meter" },
  { label: "Per Yard", value: "yard" },
];

export const toolTipOptions = {
  bg: "gray.100",
  color: "gray.700",
  fontSize: "sm",
  placement: "top",
};

export const categoriesOptions = [
  { label: "Fruits 🍇", value: "fruits" },
  {
    label: "Vegetables 🥕",
    value: "vegetables",
  },
  {
    label: "Dairy 🥛",
    value: "dairy",
  },
  {
    label: "Meat 🍖",
    value: "meat",
  },
  {
    label: "Drinks 🥤",
    value: "drinks",
  },
];

export const tableData = [
  {
    company_id: 1,
    in_stock: 256,
    is_available: true,
    low_stock: 10,
    retail_price: 76000,
    shop_id: "Tiin Market (Sayram)",
    supply_price: 58890,
    margin: 29.5,
    currency: "UZS",
  },
];

const conversionMap = {
  "": 0,
  0: "",
};

// functions
function getInitialPrices({ id, title }) {
  return {
    shop_id: id,
    title,
    retail_price: "",
    supply_price: "",
    margin: "",
    currency: "UZS",
    max_price: 0,
    min_price: 0,
    whole_sale_price: 0,
  };
}

function getInitialRemains({ id, title }) {
  return {
    shop_id: id,
    title,
    amount: "",
    small_left: "",
    has_trigger: true,
    is_available: true,
  };
}

export function convertTo(type, src) {
  let convert;

  if (type === "int") {
    convert = (str) => parseInt(str, 10);
  } else if (type === "str") {
    convert = (int) => int.toString();
  }

  const copiedSrc = cloneDeep(src);

  problematicEntries.forEach(({ entryName, childEntries }) => {
    copiedSrc[entryName] = copiedSrc[entryName].map((obj) => {
      const { ...newObj } = obj;

      childEntries.forEach((field) => {
        if (obj[field] !== undefined) {
          newObj[field] = conversionMap[obj[field]] ?? convert(obj[field]);
        }
      });

      return newObj;
    });
  });

  return copiedSrc;
}

export async function submitImagesToWorker(previews) {
  let images = [];
  let error = "";

  worker.postMessage("submit_images", {
    images: previews.map(({ preview, serverFetched }) => ({
      preview,
      serverFetched: serverFetched || false,
    })),
  });

  try {
    const urls = await worker.getResultFromWorker();
    images = urls?.map((url, i) => ({
      image_url: url,
      sequence_number: i,
    }));
  } catch (err) {
    error = err;
  }

  return [images, error];
}

export function formatInitialMargin(shopPrices) {
  return shopPrices.map((shopPrice) => {
    let margin = "";

    if (shopPrice.supply_price && shopPrice.retail_price) {
      margin = (
        ((shopPrice.retail_price - shopPrice.supply_price) /
          shopPrice.supply_price) *
        100
      ).toFixed(2);
    }

    return { ...shopPrice, margin };
  });
}

export function getMutationFn(product_id) {
  if (product_id) {
    return updateProduct.bind(null, product_id);
  }
  return createProduct;
}

export function reformatProductImgs(images) {
  if (Array.isArray(images)) {
    return images.map(({ image_url }) => ({
      serverFetched: true,
      preview: image_url,
    }));
  }
  return [];
}

export function removeBaseEndpoint(arr) {
  return arr.map((item) => {
    return {
      ...item,
      image_url: item.image_url.replace(`${import.meta.env.VITE_CDN_URL}/`, ""),
    };
  });
}

function concat(field, to) {
  let initialValuesGetter;

  if (field === "shop_prices") {
    initialValuesGetter = getInitialPrices;
  } else if (field === "measurement_values") {
    initialValuesGetter = getInitialRemains;
  }

  const missingShops = to.filter(
    ({ id }) => !this[field].some((shop) => shop.shop_id === id),
  );

  return [...this[field], ...missingShops.map(initialValuesGetter)];
}
