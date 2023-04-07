import { flow } from "lodash";
import { dates } from "./getDateRange";

const toSeconds = (x) => x / 1000;
const toMinutes = (x) => x / 60;
const toHours = (x) => x / 60;
const toDays = (x) => x / 24;

const fromMs = flow([toSeconds, toMinutes, toHours, toDays]);

export default function getRangeDate(range) {
  const { startDate, endDate } = range;

  const ms = Math.abs(endDate - startDate); // may result in NaN

  if (ms === 0) {
    return dates.today;
  }

  const days = Math.round(fromMs(ms));

  if (days === 1) {
    const date = new Date().getDate();

    if (date === endDate.getDate()) {
      return dates.today;
    }

    return dates.yesterday;
  }
  if (days === 7) {
    return dates.week;
  }
  if (days <= 31 && days >= 28) {
    return dates.month;
  }
  if (days <= 366 && days >= 365) {
    return dates.year;
  }

  return dates.custom;
}
