export const initializeCompany = (data) => {
  return fetch(`${import.meta.env.VITE_BASE_URL}/company`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("temporary_token")}`,
    },
  });
};

export const getCompanyTypes = () => {
  return fetch(`${import.meta.env.VITE_BASE_URL}/company_type`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("temporary_token")}`,
    },
  });
};

export const getCompanySizes = () => {
  return fetch(`${import.meta.env.VITE_BASE_URL}/company_size`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("temporary_token")}`,
    },
  });
};
