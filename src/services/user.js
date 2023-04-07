import request from "@/utils/axios";

export const getUserByPhone = (params) => {
  return request({ method: "get", url: "/user/get_user_by_phone", params });
};

export const getUserPermissions = () => {
  return request({ method: "get", url: "/user/get_user_permission" });
};

export const getProfile = async (params) => {
  const res = await request({
    url: "user/profile",
    method: "GET",
    params,
  });
  return res;
};

// create profile is in auth.js

export const updateProfile = async (data, params) => {
  const res = await request({
    url: "user/profile",
    method: "PUT",
    data,
    params,
  });
  return res;
};

export const updatePassword = async (data, params) => {
  const res = await request({
    url: "user/change_password",
    method: "POST",
    data,
    params,
  });
  return res;
};
