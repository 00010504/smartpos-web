import request from "@/utils/axios";

export const updateCashboxList = async (data, params) => {
  const res = await request({
    url: "cashbox",
    method: "POST",
    data,
    params,
  });
  return res;
};

export const getCashboxList = async (params) => {
  const res = await request({
    url: "cashbox",
    method: "GET",
    params,
  });
  return res;
};

export const deleteCashbox = async (id, params) => {
  const res = await request({
    url: `cashbox/${id}`,
    method: "DELETE",
    params,
  });
  return res;
};

export const getPaymentType = async (params) => {
  const res = await request({
    url: "payment_type",
    method: "GET",
    params,
  });
  return res;
};

export const getSingleCashbox = async (id) => {
  const res = await request({
    url: `cashbox/${id}`,
    method: "GET",
  });
  return res;
};

export const updateSingleCashbox = async (id, data) => {
  const res = await request({
    url: `cashbox/${id}`,
    method: "PUT",
    data,
  });
  return res;
};
