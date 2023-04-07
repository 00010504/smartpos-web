import { secondsToMinutes } from "date-fns";

const timeUnits = {
  sec: "sec",
  min: "min",
  hour: "hour",
};

export default function formatSeconds(seconds) {
  if (Number.isNaN(seconds) || seconds === Infinity) {
    return "";
  }
  const msg =
    seconds > 60
      ? `${secondsToMinutes(seconds)} ${timeUnits.min}` // in minutes
      : `${seconds} ${timeUnits.sec}`;
  return msg;
}
