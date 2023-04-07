import Stepper from "@/classes/Stepper";
import createSchema from "@/helpers/createSchema";
import { cloneDeep } from "lodash";
import SingleWorker from "@/classes/SingleWorker";

const worker = SingleWorker.getInstance();

export const stepper = new Stepper({
  initialStep: 0,
  firstStep: 0,
  lastStep: 2,
});

export const steps = ["Main", "Requisites", "Documents"];

export const ACTIONS = {
  SET_VALUES: "SET_VALUES",
};

export const initialValues = {
  supplier_company_name: "",
  agreement_number: "",
  name: "",
  address: "",
  phone_number: "",
  supplier_company_legal_name: "",
  bank_account: "",
  legal_address: "",
  bank_name: "",
  tin: "",
  ibt: "",
  files: [],
};

export const schema = createSchema({
  supplier_company_name: "default",
  agreement_number: "default",
  name: "default",
  phone_number: "phone",
  supplier_company_legal_name: "default",
  bank_account: "default",
  legal_address: "address",
  bank_name: "default",
  // tin: "default",
  ibt: "default",
});

export const formReducer = (state, action) => {
  const clonedState = cloneDeep(state);
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_VALUES: {
      console.log(payload);
      return clonedState;
    }
    default: {
      return state;
    }
  }
};

// export const btnState = {
//   value: "",
//   onClick: () => {},
//   type: "button",
//   isLoading: null,
//   form: null,
//   visibility: "hidden",
// };

export const reformatDocs = (docs) => {
  if (Array.isArray(docs)) {
    return docs.map((doc) => ({
      serverFetched: true,
      name: doc.name,
      file_url: doc.file_url,
      preview: `${import.meta.env.VITE_CDN_URL}/${doc.file_url}`,
    }));
  }
  return [];
};

export async function submitFilesToWorker(files) {
  let _files = [];
  let error = "";

  worker.postMessage("submit_files", {
    files: files.map(({ name, preview, serverFetched, file_url }) => ({
      name,
      preview,
      serverFetched: serverFetched || false,
      file_url,
    })),
  });

  try {
    _files = await worker.getResultFromWorker();
  } catch (err) {
    error = err;
  }

  return [_files, error];
}

export const fieldNames = [
  [
    "supplier_company_name",
    "address",
    "name",
    "agreement_number",
    "zipcode",
    "phone_number",
  ],
  [
    "supplier_company_legal_name",
    "bank_account",
    "legal_address",
    "bank_name",
    "tin",
    "ibt",
  ],
  ["files"],
];
