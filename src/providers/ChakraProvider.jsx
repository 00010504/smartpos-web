import { ChakraProvider } from "@chakra-ui/react";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";
import theme from "@/theme";
import { useColorModeContext } from "@/contexts/colorModeContext";

export default function Chakra({ children }) {
  const { colorMode } = useColorModeContext();

  const copiedTheme = cloneDeep(theme);

  copiedTheme.colors.colors = copiedTheme.colors.colors[colorMode];

  return <ChakraProvider theme={copiedTheme}>{children}</ChakraProvider>;
}

Chakra.propTypes = {
  children: PropTypes.element.isRequired,
};
