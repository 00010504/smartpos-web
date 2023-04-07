import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { importValidationContext } from "@/contexts/importValidationContext";

export default function ImportValidationProvider(props) {
  const { children } = props;

  const [importValidation, setImportValidation] = useState({
    percentage: 0,
    hasUploaded: false,
    filename: "",
    bytesUploaded: 0,
    bytesTotal: 0,
    remainingTime: 0,
    hasValidationStarted: false,
  });

  const value = useMemo(
    () => ({ importValidation, setImportValidation }),
    [importValidation],
  );

  return (
    <importValidationContext.Provider value={value}>
      {children}
    </importValidationContext.Provider>
  );
}

ImportValidationProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
