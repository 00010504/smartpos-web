import {
  endOfMonth,
  endOfYear,
  nextMonday,
  previousMonday,
  startOfMonth,
  startOfYear,
  sub,
} from "date-fns";

export const dates = {
  today: "today",
  yesterday: "yesterday",
  tomorrow: "tomorrow",
  week: "week",
  month: "month",
  year: "year",
  custom: "custom",
};

export default function getDateRange(date) {
  const today = new Date();

  switch (date) {
    case dates.today: {
      return {
        date_from: today,
        date_to: today,
      };
    }
    case dates.yesterday: {
      const yesterday = sub(today, { days: 1 });
      return {
        date_from: yesterday,
        date_to: today,
      };
    }
    case dates.week: {
      const previous_monday = previousMonday(today);
      const next_monday = nextMonday(today);

      return {
        date_from: previous_monday,
        date_to: next_monday,
      };
    }
    case dates.month: {
      const month_start = startOfMonth(today);
      const month_end = endOfMonth(today);

      return {
        date_from: month_start,
        date_to: month_end,
      };
    }
    case dates.year: {
      const year_start = startOfYear(today);
      const year_end = endOfYear(today);

      return {
        date_from: year_start,
        date_to: year_end,
      };
    }
    default: {
      return {
        date_from: today,
        date_to: today,
      };
    }
  }
}
