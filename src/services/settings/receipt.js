import request from "@/utils/axios";

export const createCheque = (data) => {
  return request({ method: "post", url: "cheque", data });
};

export const updateCheque = (id, data) => {
  return request({ method: "put", url: `/cheque/${id}`, data });
};

export const getReceipts = async (params) => {
  const res = await request({
    url: "cheque",
    method: "GET",
    params,
  });
  return res;
};

export const getReceiptBlocks = async (params) => {
  const res = await request({
    url: "cheque_blocks",
    method: "GET",
    params,
  });
  return res;
};

export const deleteReceipt = async (id) => {
  const res = await request({
    url: `cheque/${id}`,
    method: "DELETE",
  });
  return res;
};

export const getSingleReceipt = async (id) => {
  const res = await request({
    url: `cheque/${id}`,
    method: "GET",
  });
  return res;
};
