import ExpandIcon from "@/components/atoms/Icons/Expand";
import { Box, Collapse, Flex, ListItem, useColorMode } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import NavIconWithPopover from "./NavIconWithPopover";
import SubItem from "./SubItem";

export default function SidebarItem({
  Icon,
  title,
  isClicked,
  onClick,
  isDragging,
  isSidebarOpen,
  path,
  subpath,
  children,
}) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <>
      <ListItem
        role="group"
        cursor="pointer"
        display="flex"
        alignItems="center"
        overflow="hidden"
        onClick={onClick}
      >
        <NavIconWithPopover
          Icon={Icon}
          isDragging={isDragging}
          isSidebarOpen={isSidebarOpen}
          path={path}
          subpath={subpath}
          title={title}
        >
          {children}
        </NavIconWithPopover>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
          mr="4"
        >
          <Box
            as="span"
            _groupHover={{
              color: colorMode === "light" ? "brand.500" : "white",
            }}
            color="colors.icon"
            whiteSpace="nowrap"
            mt="2px"
            transition=".2s ease"
            fontSize="15px"
          >
            {t(title)}
          </Box>
          <ExpandIcon
            style={{
              rotate: isClicked ? "90deg" : "0deg",
            }}
            color="colors.icon"
            transition=".2s ease-out"
          />
        </Flex>
      </ListItem>

      <Collapse in={isClicked && isSidebarOpen} animateOpacity>
        {children.map((child) => (
          <SubItem key={child.id} path={path} subpath={subpath} child={child} />
        ))}
      </Collapse>
    </>
  );
}

SidebarItem.defaultProps = {
  subpath: "",
};

SidebarItem.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  isClicked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  subpath: PropTypes.string,
  children: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
