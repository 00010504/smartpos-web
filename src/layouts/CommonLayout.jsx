import { Box, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function CommonLayout({ sidebar, children, styles, header }) {
  return (
    <Flex {...styles}>
      {sidebar}
      <Box
        borderLeft="1px dashed"
        borderColor="colors.sidebarBorder"
        flexGrow={1}
        overflowX="hidden"
      >
        {header}
        <Box p="28px 36px 45px 36px">{children}</Box>
      </Box>
    </Flex>
  );
}

CommonLayout.defaultProps = {
  sidebar: null,
  styles: {},
  header: null,
};

CommonLayout.propTypes = {
  sidebar: PropTypes.element,
  children: PropTypes.element.isRequired,
  styles: PropTypes.objectOf(PropTypes.string),
  header: PropTypes.element,
};
