import request from "@/utils/axios";

export const getLayers = (params) => {
  return request({ method: "get", url: "/label/product_field", params });
};

export const getPriceTags = (params) => {
  return request({ method: "get", url: "/label", params });
};

export const getPriceTag = (id) => {
  return request({ method: "get", url: `/label/${id}` });
};

export const createPriceTag = (data) => {
  return request({ method: "post", url: "/label", data });
};

export const updatePriceTag = (id, data) => {
  return request({ method: "put", url: `/label/${id}`, data });
};

export const deletePriceTag = (data) => {
  return request({ method: "delete", url: "/label", data });
};
