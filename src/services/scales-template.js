import request from "@/utils/axios";

export const createScalesTemplate = (data) => {
  return request({ method: "post", url: "/scales-template", data });
};

export const getScalesTemplates = (params) => {
  return request({ method: "get", url: "/scales-template", params });
};

export const getScalesTemplate = (id, params) => {
  return request({ method: "get", url: `/scales-template/${id}`, params });
};
