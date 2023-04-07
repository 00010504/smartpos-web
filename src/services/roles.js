import request from "@/utils/axios";

export const createRole = (data) => {
  return request({ method: "post", url: "/role", data });
};

export const getRoles = (params) => {
  return request({ method: "get", url: "/role", params });
};

export const deleteRole = (id) => {
  return request({ method: "delete", url: `/role/${id}` });
};

export const getRole = (id) => {
  return request({ method: "get", url: `/role/${id}` });
};

export const editRole = (id, data) => {
  return request({ method: "put", url: `/role/${id}`, data });
};

export const getModules = (params) => {
  return request({ method: "get", url: "/module", params });
};
