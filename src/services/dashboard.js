import request from "@/utils/axios";

export const getDashboardData = (params) => {
  return request({ method: "get", url: "/dashboard", params });
};

export const placeholderFn = () => {};
