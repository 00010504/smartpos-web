import request from "@/utils/axios";

export const createCategory = (data) => {
  return request({ method: "post", url: "/category", data });
};

export const getCategories = (params) => {
  return request({ method: "get", url: "/category", params });
};

export const deleteCategory = (id, params) => {
  return request({ method: "delete", url: `/category/${id}`, params });
};

export const updateCategory = (id, data) => {
  return request({ method: "put", url: `/category/${id}`, data });
};
