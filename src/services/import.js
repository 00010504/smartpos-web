import { read } from "xlsx/xlsx.mjs";
import request from "@/utils/axios";

export const getExampleExcel = () => {
  return request({ method: "post", url: "/exceltemplate" });
};

export const getImports = (params) => {
  return request({ method: "get", url: "/import", params });
};

export const getImportItems = (id, params) => {
  return request({ method: "get", url: `/import/${id}/allitems`, params });
};

export const sendImportToValidation = (data) => {
  return request({ method: "post", url: "/import", data });
};

export const getImportPropertiesTemplate = () => {
  return request({ method: "get", url: "/import/import-properties-template" });
};

export const confirmImport = (id) => {
  return request({ method: "put", url: `/import/${id}/confirm` });
};

export const acceptImport = (id) => {
  return request({ method: "put", url: `/import/${id}/finish` });
};

export const downloadExcelById = (id) => {
  return request({ method: "post", url: `/exceltemplate_import/${id}` });
};

export const getExcelFile = async (url, options) => {
  try {
    const wb = read(await (await fetch(url)).arrayBuffer(), options);
    return wb;
  } catch (err) {
    throw new Error("Error while reading excel file");
  }
};

export const getImportValidationLogs = (import_id) => {
  return request({
    method: "get",
    url: `/import/${import_id}/validation-error-log`,
  });
};
