import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ActiveSign from "./ActiveSign";

export default function SubItem({ path, subpath, child }) {
  const isActive = subpath === child.path;
  const { t } = useTranslation();

  return (
    <Flex alignItems="center" gap="36px">
      <Box w="0">{isActive && <ActiveSign />}</Box>
      <LinkBox
        role={isActive ? null : "group"}
        w="full"
        display="flex"
        gap={3}
        p="8px"
        px="12px"
        mr="4"
        cursor="pointer"
        rounded="xl"
        bg={isActive ? "colors.sidebarLinkBg" : null}
      >
        <Box
          as="span"
          color={isActive ? "brand.500" : "gray.500"}
          _groupHover={{ color: "colors.grey45" }}
          transition=".2s ease"
        >
          ●
        </Box>
        <LinkOverlay
          as={RouterLink}
          to={`${path}/${child.path}`}
          flexGrow={1}
          _groupHover={{ color: "colors.grey45" }}
          transition=".2s ease"
          fontSize="14px"
          pt="2px"
          color={isActive ? "colors.grey45" : "colors.icon"}
        >
          {t(child.title)}
        </LinkOverlay>
      </LinkBox>
    </Flex>
  );
}

SubItem.defaultProps = {
  subpath: "",
};

SubItem.propTypes = {
  path: PropTypes.string.isRequired,
  subpath: PropTypes.string,
  child: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};
