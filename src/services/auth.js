export const login = (data) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/auth/login`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const register = (data) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/auth/register`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const verifyCode = (data) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/auth/verify`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("otpToken")}`,
      "Content-Type": "application/json",
    },
  });
};

export const createProfile = (data) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/api/v1/user/profile`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("temporary_token")}`,
    },
  });
};

export const forgotPassword = (data) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/auth/forgot_password`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const setPassword = (data, headers = {}) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/auth/set_password`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};

export const refreshToken = (data, headers = {}) => {
  return fetch(`${import.meta.env.VITE_AUTH_URL}/auth/refresh-token`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};
