import { t } from "i18next";
import { format, compareAsc } from "date-fns";
import { cloneDeep } from "lodash";
import productsIcon from "@/assets/icons/box.svg";
import servicesicon from "@/assets/icons/services.svg";
import exchangeIcon from "@/assets/icons/exchange.svg";
import returnIcon from "@/assets/icons/return.svg";
import getDateRange from "@/helpers/getDateRange";

export const initialData = {
  gross_sale: 0,
  refund: 0,
  net_sale: 0,
  gross_profit: 0,
  top_products: [
    {
      id: "",
      name: "",
      price: 0,
    },
  ],
  payments: [
    // {
    //   id: shop?.id,
    //   store_name: shop?.name,
    //   payments: payments_types.map(({ name, price }) => ({
    //     name,
    //     value: price,
    //   })),
    //   total_price,
    // },
  ],
  shop_analytics: [
    {
      shop: {
        id: "",
        name: "",
        is_added: false,
      },
      date: format(new Date(), "yyyy-MM-dd"),
      price: 0,
    },
  ],
  transactions: {
    products: 0,
    returns: 0,
    exchanges: 0,
    services: 0,
  },
};

// export const partialDataset = [
//   {
//     name: "2022-12-28",
//     "Gross sales": 400000,
//     "Net sales": 240000,
//   },
//   {
//     name: "2022-12-29",
//     "Gross sales": 300000,
//     "Net sales": 139800,
//   },
//   {
//     name: "2022-12-30",
//     "Gross sales": 200000,
//     "Net sales": 680000,
//   },
// ];

export function genDataset(analytics) {
  const dataset = cloneDeep(analytics);

  dataset.sort((first, second) => {
    const firstDate = new Date(first.date);
    const secondDate = new Date(second.date);

    return compareAsc(firstDate, secondDate);
  });

  const modifiedDataset = dataset.map(({ date, price, shop }) => ({
    name: date,
    [shop.name]: price,
  }));

  return modifiedDataset.reduce((acc, curr) => {
    const foundIndex = acc.findIndex((elm) => elm.name === curr.name);

    if (foundIndex !== -1) {
      acc[foundIndex] = { ...acc[foundIndex], ...curr };
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);
}

export function genKeys(dataset) {
  const shop_names = dataset.reduce((set, curr) => {
    Object.keys(curr).forEach((key) => {
      if (key !== "name") {
        set.add(key);
      }
    });
    return set;
  }, new Set());
  return Array.from(shop_names);
}

export function genPayments(data) {
  return data.map(({ shop, payments_types, total_price }) => {
    return {
      id: shop?.id,
      store_name: shop?.name,
      payments: payments_types?.map(({ name, price }) => ({
        name,
        value: price,
      })),
      total_price,
    };
  });
}

export function genSalesCounts(data) {
  let sales = ["gross_profit", "gross_sale", "net_sale", "refund"];

  sales = sales.map((key) => {
    return {
      title: t(key),
      value: data[key] || 0,
      unit: "UZS",
    };
  });

  return sales;
}

export function genTransactions(data) {
  let transactions = [
    { name: "exchanges", icon: exchangeIcon },
    { name: "products", icon: productsIcon },
    { name: "returns", icon: returnIcon },
    { name: "services", icon: servicesicon },
  ];

  transactions = transactions.map(({ name, icon }) => {
    return {
      name: t(name),
      value: data[name] || 0,
      icon,
    };
  });

  return transactions;
}

function toDateObj(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      let date = value.split(" ").at(0);
      date = date.split("-");
      let tmp = date[0];
      date[0] = date[1];
      date[1] = tmp;
      return { [key]: new Date(date.join("-")) };
    })
    .reduce((acc, curr) => {
      acc = { ...acc, ...curr };
      return acc;
    }, {});
}

export function getRangePickerDates({ date_from, date_to }) {
  if (date_from && date_to) {
    return toDateObj({
      date_from,
      date_to,
    });
  }

  return getDateRange("year");
}

export const styles = {
  card: {
    p: "20px",
    bg: "colors.grayF9",
    borderRadius: "20px",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
  },
};
