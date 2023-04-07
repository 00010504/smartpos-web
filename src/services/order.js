import request from "@/utils/axios";

export const getSupplierOrders = (params) => {
  return request({ method: "get", url: "/supplier_order", params });
};

export const createSupplierOrder = (data) => {
  return request({ method: "post", url: "/supplier_order", data });
};

export const getSupplierOrder = (id) => {
  return request({ method: "get", url: `/supplier_order/${id}` });
};

export const getOrderStatus = (data) => {
  return request({ method: "get", url: "/supplier/status", data });
};

export const deleteSupplierOrder = (data) => {
  return request({ method: "delete", url: "/supplier_orders", data });
};

export const updateSupplierOrder = (id, data) => {
  return request({ method: "put", url: `/supplier_order/${id}`, data });
};

export const getSupplierOrderItems = (id) => {
  return request({ method: "get", url: `/supplier_order/${id}/allitems` });
};

export const supplierOrderItem = (data) => {
  return request({ method: "post", url: "/supplier_order_item", data });
};

export const deleteSupplierOrderItem = (id) => {
  return request({ method: "delete", url: `/supplier_order_item/${id}` });
};

export const supplierOrderStatus = (id) => {
  return request({ method: "put", url: `/supplier_order_status/${id}` });
};

export const updateSupplierOrderCount = (id, data) => {
  return request({ method: "put", url: `/supplier_order_amount/${id}`, data });
};

export const finishSupplierOrder = (id) => {
  return request({ method: "put", url: `/supplier_order_finish/${id}` });
};

export const supplierOrderExcel = (id) => {
  return request({ method: "post", url: `/exceltemplate/${id}` });
};
