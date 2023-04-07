import { createContext, useContext } from "react";

const colorModeContext = createContext({
  colorMode: false,
  setColorMode: () => {},
});

colorModeContext.displayName = "colorModeContext";

const ColorModeContextConsumer = colorModeContext.Consumer;

export {
  ColorModeContextConsumer as ColorModeConsumer,
  colorModeContext,
  useColorModeContext,
};

function useColorModeContext() {
  return useContext(colorModeContext);
}
