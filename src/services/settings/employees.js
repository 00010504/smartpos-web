import request from "@/utils/axios";

export const getEmployees = (params) => {
  return request({ method: "get", url: "/employee", params });
};

export const getEmployee = (id) => {
  return request({ method: "get", url: `/employee/${id}` });
};

export const createEmployee = (data) => {
  return request({ method: "post", url: "/employee", data });
};

export const deleteEmployee = (id) => {
  return request({ method: "delete", url: `/employee/${id}` });
};

export const updateEmployee = (id, data) => {
  return request({ method: "put", url: `/employee/${id}`, data });
};
