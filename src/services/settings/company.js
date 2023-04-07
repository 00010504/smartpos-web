import request from "@/utils/axios"

export const updateCompany = async (data, params) => {
  const res = request({
    url: "company",
    method:"PUT",
    data,
    params,
  })
  return res
}

export const getCompany = async (params) => {
  const res = request({
    url: "current_company",
    method:"GET",
    params,
  })
  return res
}

export const getReceipt = async (params) => {
  const res = request({
    url: "cheque",
    method: "GET",
    params,
  })
  return res
}