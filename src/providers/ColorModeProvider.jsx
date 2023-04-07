import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { colorModeContext } from "@/contexts/colorModeContext";

const initialState = localStorage.getItem("chakra-ui-color-mode") || "light";

export default function ColorModeProvider(props) {
  const { children } = props;

  const [colorMode, setColorMode] = useState(initialState);

  const value = useMemo(
    () => ({ colorMode, setColorMode }),
    [colorMode, setColorMode],
  );

  return (
    <colorModeContext.Provider value={value}>
      {children}
    </colorModeContext.Provider>
  );
}

ColorModeProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
