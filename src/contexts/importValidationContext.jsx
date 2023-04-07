import { createContext, useContext } from "react";

const importValidationContext = createContext({
  importValidation: {
    percentage: 0,
    hasUploaded: false,
    filename: "",
    bytesUploaded: 0,
    bytesTotal: 0,
    remainingTime: 0,
    hasValidationStarted: false,
  },
  setImportValidation: () => {},
});

importValidationContext.displayName = "importValidationContext";

const ImportValidationContextConsumer = importValidationContext.Consumer;

export {
  ImportValidationContextConsumer as ImportValidationConsumer,
  importValidationContext,
  useImportValidationContext,
};

function useImportValidationContext() {
  return useContext(importValidationContext);
}
