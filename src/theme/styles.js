import { mode } from "@chakra-ui/theme-tools";

// Chakra gives you access to `colorMode` and `theme` in `props`
export default {
  global: (props) => ({
    body: {
      bg: mode("#fff", "#1b1d21")(props),
    },
  }),
};
