/* eslint-disable no-param-reassign */
import axios from "axios";
import settings from "@/config/settings";
import { refreshToken } from "@/services/auth";

const request = axios.create({
  baseURL: settings.baseURL,
  timeout: settings.requestTimeout,
});

request.defaults.headers.timezone = new Date().getTimezoneOffset();
request.defaults.headers["Accept-Language"] =
  localStorage.getItem("lang") ?? "ru";

request.interceptors.request.use((config) => {
  // config.validateStatus = (status) => status < 500;
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  return response.data;
}, errorHandler);

export function errorHandler(error) {
  // Using toJSON you get an object with more information about the HTTP error
  // const errObj = error.toJSON();
  if (error.response) {
    // server responded with a status code that falls out of the range of 2xx

    if (error.response?.data?.code === 403) {
      const refresh_token = localStorage.getItem("refresh_token");
      refreshToken({ refresh_token })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((res) => {
          localStorage.setItem("token", res.token);
          localStorage.setItem("refresh_token", res.refresh_token);
          // should we really reload the page, isn't there any other better way?
          window.location.reload();
        })
        .catch((err) => {
          console.error("Error: ", err);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          window.location.replace("/auth/login");
        });
    }

    // console.error(error.response);
    // toast({ title: error.message });
    return Promise.reject(error.response);
  }
  if (error.request) {
    // no response received from server
    // console.error(error.request);
    // toast({
    //   title: "No response from the server",
    // });
    return Promise.reject(error.request);
  }
  // else {
  // something happened in setting up the request
  // console.error(errObj);
  // toast({
  //   title: "Error happened in setting up the request",
  // });
  // }

  return Promise.reject(error);
}

export default request;
