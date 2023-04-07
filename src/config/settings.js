import logo from "@/assets/BrandLogo.svg";

const settings = {
  baseURL: import.meta.env.VITE_BASE_URL,
  requestTimeout: 60000 * 3,
  rowsPerPage: 10,
  defaultLanguage: "en",
  staleTime: 1000 * 60 * 2,
  idleTimeout: 3000,
  project: {
    logo,
  },
  languages: [
    {
      name: "English",
      code: "en",
    },
    {
      name: "Русский",
      code: "ru",
    },
  ],
};

export default settings;
