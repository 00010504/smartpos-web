import request from "@/utils/axios";

export const getMeasurementUnits = () => {
  return request({ method: "get", url: "/measurement_unit" });
};

export const empty = () => {};
