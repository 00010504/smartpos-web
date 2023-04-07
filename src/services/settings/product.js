import request from "@/utils/axios";

export const getMainUnits = async (params) => {
  const res = await request({
    url: "measurement_unit",
    method: "GET",
    params,
  });
  return res;
};
export const updateMainUnit = async (data, params) => {
  const res = await request({
    url: "measurement_unit",
    method: "POST",
    data,
    params,
  });
  return res;
};
export const deleteMainUnit = async (id) => {
  const res = await request({
    url: `measurement_unit/${id}`,
    method: "DELETE",
  });
  return res;
};

export const getUnits = async (params) => {
  const res = await request({
    url: "units",
    method: "GET",
    params,
  });
  return res;
};

export const getUnitById = async (id) => {
  const res = await request({
    url: `measurement_unit/${id}`,
    method: "GET",
  });
  return res;
};

export const updateSingleUnit = async (id, data) => {
  const res = await request({
    url: `measurement_unit/${id}`,
    method: "PUT",
    data,
  });
  return res;
};

export const downloadProducts = (data) => {
  return request({ method: "post", url: "/exceltemplate_product", data });
};
