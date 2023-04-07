import request from "@/utils/axios";

export const getSuppliers = (params) => {
  return request({ method: "get", url: "/supplier", params });
};

export const createSupplier = (data) => {
  return request({ method: "post", url: "/supplier", data });
};

export const getSupplier = (id) => {
  return request({ method: "get", url: `/supplier/${id}` });
};

export const deleteSupplier = (id) => {
  return request({ method: "delete", url: `/supplier/${id}` });
};

export const updateSupplier = (id, data) => {
  return request({ method: "put", url: `/supplier/${id}`, data });
};

export const getSuppliersStatus = (params) => {
  return request({ method: "get", url: "/supplier/status", params });
};
