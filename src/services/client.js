import request from "@/utils/axios";

export const createClient = (data) => {
  return request({ method: "post", url: "/client", data });
};

export const getClients = (params) => {
  return request({ method: "get", url: "/client", params });
};

export const deleteClient = (id) => {
  return request({ method: "delete", url: `/client/${id}` });
};

export const getClient = (id) => {
  return request({ method: "get", url: `/client/${id}` });
};

export const updateClient = (id, data) => {
  return request({ method: "put", url: `/client/${id}`, data });
};
