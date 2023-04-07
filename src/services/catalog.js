import request from "@/utils/axios";

export const createProduct = (data) => {
  return request({ method: "post", url: "/product", data });
};

export const getProducts = (params) => {
  return request({ method: "get", url: "/product", params });
};

export const deleteProduct = (id) => {
  return request({ method: "delete", url: `/product/${id}` });
};

export const getProduct = (id) => {
  return request({ method: "get", url: `/product/${id}` });
};

export const getProductHistory = (id) => {
  return request({ method: "get", url: `/product/${id}/history` });
};

export const deleteProducts = (data) => {
  return request({ method: "delete", url: "/product", data });
};
export const updateProduct = (id, data) => {
  return request({ method: "put", url: `/product/${id}`, data });
};
