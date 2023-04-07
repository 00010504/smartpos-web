// const dataset date format = "yyyy-MM-dd";
import { cloneDeep } from "lodash";

export default function filterDataset({ dataset, store, byDate }) {
  const _dataset = cloneDeep(dataset);

  const index = getDateIndex(byDate);
  const result = [];

  _dataset.forEach((entry, i) => {
    const date = entry;
    const next_date = _dataset[i + 1];
    const date_token = entry.name.split("-")[index];
    const next_date_token = next_date?.name?.split("-")[index];

    if (next_date && date_token === next_date_token) {
      const obj = {};
      if (store === "All") {
        Object.keys(date).forEach((key) => {
          if (key !== "name") {
            // obj[key] = date[key] + next_date[key];
            obj[key] = date[key];
          }
        });
        result.push({
          name: monthMap[date_token],
          ...obj,
        });
      } else {
        result.push({
          name: monthMap[date_token],
          // [store]: date[store] + next_date[store],
          [store]: date[store],
        });
      }
    } else {
      result.push({
        ...date,
        name: monthMap[date_token],
      });
    }
  });

  return merge(result);
}

function getDateIndex(byDate) {
  if (byDate === "all") {
    return 0;
  }
  if (byDate === "year") {
    return 1;
  }
  // if (byDate === "month") {
  //   return "week";
  // }
  if (byDate === "week") {
    return 2;
  }
  return 2;
}

function merge(dataset) {
  const _dataset = cloneDeep(dataset);
  const names = [];
  const result = [];

  _dataset.forEach((entry) => {
    if (!names.includes(entry.name)) {
      names.push(entry.name);
      result.push(entry);
    } else {
      const i = names.length - 1;
      const obj = Object.keys(entry)
        .filter((it) => it !== "name")
        .reduce((acc, currKey) => {
          acc[currKey] = entry[currKey] + result[i][currKey];
          return acc;
        }, {});

      result[i] = { name: names[i], ...obj };
    }
  });

  return result;
}

const monthMap = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};
