import { cloneDeep } from "lodash";
import { utils } from "xlsx/xlsx.mjs";

/*
TABLE DATA STRUCTURE

worksheet = {
  isWorksheetReady: bool,
  headers: string[]
  data: Array<Array<string || number>>
}

*/

export function importReducer(state, action) {
  const { type, payload } = action;
  const stateClone = cloneDeep(state);

  switch (type) {
    case ACTIONS.setWorksheet: {
      return genWorksheet(payload.wb);
    }
    case ACTIONS.setColHeader: {
      stateClone.headers[payload.colIdx] = payload.newHeader;
      return stateClone;
    }
    default: {
      return state;
    }
  }
}

export const initialState = {
  isWorksheetReady: false,
  headers: [],
  data: [],
};

export const ACTIONS = {
  setWorksheet: "setWorksheet",
  setColHeader: "setColHeader",
};

export function checkHeader(header, property, templates) {
  return (
    templates?.includes(header) ||
    property?.is_new ||
    !property?.is_uploadable ||
    property?.is_attribute
  );
}

export const checkHeaders = (headers, properties, templates) => {
  let isValid = true;
  const atLeastOneUpload = properties.some(
    (property) => property.is_uploadable,
  );

  if (!properties.length) {
    return false;
  }

  if (!atLeastOneUpload) {
    return false;
  }

  for (let i = 0; i < headers.length; i += 1) {
    const header = headers[i];
    if (!checkHeader(header, properties[i], templates)) {
      isValid = false;
      break;
    }
  }

  return isValid;
};

export const getFilePayload = (uuid) => {
  try {
    return JSON.parse(sessionStorage.getItem("import"))[uuid];
  } catch (e) {
    return null;
  }
};

function genWorksheet(workbook) {
  const worksheet = workbook.SheetNames[0];
  const ws = workbook.Sheets[worksheet] || {};
  const sheetRows = utils.sheet_to_json(ws, { header: 1, defval: "" }) || [];

  let headers = sheetRows[0] || [];
  headers = headers.map((header) => header.toUpperCase());

  const data = sheetRows.slice(1) || [];

  return {
    isWorksheetReady: true,
    headers,
    data,
  };
}
