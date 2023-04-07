import request from "@/utils/axios";

export const upload = (data, params) => {
  return request({
    url: "/upload",
    method: "post",
    data,
    params,
  });
};

export const ping = (data, params) => {
  return request({
    url: "api/v1/ping",
    method: "post",
    data,
    params,
  });
};
