import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  LinkBox,
  LinkOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
  useColorMode,
  Divider,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function NavIconWithPopover({
  Icon,
  isDragging,
  isSidebarOpen,
  path,
  subpath,
  title,
  children,
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <Popover
      placement="right"
      offset={[0, 10]}
      isLazy
      isOpen={isOpen}
      onOpen={!isSidebarOpen && onOpen}
      onClose={onClose}
      lazyBehavior="keepMounted"
      trigger="hover"
    >
      <PopoverTrigger>
        <Box as="span">
          <Icon
            my="3"
            mx="6"
            aria-label="menu-trigger"
            aria-labelledby="menu-trigger"
            _groupHover={{
              color: colorMode === "light" ? "brand.500" : "white",
            }}
            color={isDragging ? "brand.500" : "colors.icon"}
            transition=".2s ease"
          />
        </Box>
      </PopoverTrigger>

      <Portal>
        <PopoverContent bg="colors.body" width="200px" p="10px 15px">
          <PopoverArrow bg="colors.body" />
          <PopoverHeader p="0" border="none" fontWeight="700">
            {t(title)}
          </PopoverHeader>
          <Divider />
          {children.length > 0 && (
            <PopoverBody p="0" mt={1}>
              {children.map((child) => (
                <LinkBox key={child.id} py="5px" cursor="pointer">
                  <Flex alignItems="center">
                    <Box
                      as="span"
                      color={child.path === subpath ? "brand.500" : "gray.500"}
                    >
                      ●
                    </Box>
                    <LinkOverlay
                      as={RouterLink}
                      to={`${path}/${child.path}`}
                      _hover={{ color: "colors.text" }}
                      color={child.path === subpath ? "brand.500" : "gray.500"}
                      ml="4"
                      transition=".2s ease"
                    >
                      {t(child.title)}
                    </LinkOverlay>
                  </Flex>
                </LinkBox>
              ))}
            </PopoverBody>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

NavIconWithPopover.defaultProps = {
  subpath: "",
};

NavIconWithPopover.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  subpath: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
