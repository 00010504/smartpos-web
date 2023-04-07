import request from "@/utils/axios";

export const updateShoplist = async (data, params) => {
  const res = await request({
    url: "shop",
    method: "POST",
    data,
    params,
  });
  return res;
};

export const putShoplist = async (data, params) => {
  const res = await request({
    url: "shop",
    method: "PUT",
    data,
    params,
  });
  return res;
};

export const getShops = async (params) => {
  const res = await request({
    method: "GET",
    url: "shop",
    params,
  });
  return res;
};

export const deleteShop = async (id, params) => {
  const res = await request({
    url: `shop/${id}`,
    method: "DELETE",
    params,
  });
  return res;
};

export const getSingleShop = async (id) => {
  const res = await request({
    url: `shop/${id}`,
    method: "GET",
  });
  return res;
};
export const updateSingleShop = async (id, data) => {
  const res = await request({
    url: `shop/${id}`,
    method: "PUT",
    data,
  });
  return res;
};
