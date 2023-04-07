import { extendTheme } from "@chakra-ui/react";

// Global styles overrides
import styles from "./styles";

// Foundational style overrides
import config from "./foundations/config";
import fonts from "./foundations/fonts";
import zIndices from "./foundations/zIndices";
import colors from "./foundations/colors";

// Component style overrides
import Button from "./components/button";
import Link from "./components/link";
import Input from "./components/input";
import Tooltip from "./components/tooltip";
import Heading from "./components/heading";
import Popover from "./components/popover";
import Table from "./components/table";
import FormLabel from "./components/form-label";

const components = {
  Button,
  Link,
  Input,
  Tooltip,
  Heading,
  Popover,
  Table,
  FormLabel,
};

const overrides = { config, styles, fonts, colors, components, zIndices };

const theme = extendTheme(overrides);

export default theme;
