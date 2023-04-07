import request from "@/utils/axios";

export const cashboxShift = (data) => {
  return request({ method: "post", url: "/shift", data });
};

export const getCashbox = (id) => {
  return request({ method: "get", url: `/cashbox/${id}` });
};

export const createOrder = (data) => {
  return request({ method: "post", url: "/order", data });
};

export const getOrder = (id) => {
  return request({ method: "get", url: `order/${id}` });
};

export const getAllOrder = (params) => {
  return request({ method: "get", url: "order", params });
};

export const editOrderItem = (id, data) => {
  return request({ method: "put", url: `order_item/${id}`, data });
};

export const deleteOrderItem = (id) => {
  return request({ method: "delete", url: `order_item/${id}` });
};

export const orderPayment = (data) => {
  return request({ method: "post", url: "/order_payment", data });
};

export const defaultShift = () => {
  return request({ method: "get", url: "/shift" });
};

export const addOrderClient = (id, data) => {
  return request({ method: "post", url: `order/${id}/client`, data });
};

export const deleteOrderClient = (id) => {
  return request({ method: "delete", url: `order/${id}/client` });
};

export const addOrderDiscount = (data) => {
  return request({ method: "post", url: "order_discount", data });
};

export const updateNewSaleItem = async () => {
  const res = request({
    url: "order_item",
    method: "POST",
  });
  return res;
};

export const getSaleProducts = async (params) => {
  const res = request({
    url: "products_for_sale",
    method: "GET",
    params,
  });
  return res;
};

export const updateOrderItem = async (data, params) => {
  const res = request({
    url: "order_item",
    method: "POST",
    data,
    params,
  });
  return res;
};
