import { useNavigate } from "react-router-dom";
import { Box, Flex, Image } from "@chakra-ui/react";
import settings from "@/config/settings";
import ExpandMoreIcon from "@/assets/ExpandMore.svg";
import ExpandMoreIcon2 from "@/assets/ExpandMore2.svg";
import PropTypes from "prop-types";

export default function BrandLogoRow({ isSidebarOpen, onMenuCollapse }) {
  const navigate = useNavigate();

  return (
    <Box pos="relative">
      <Flex alignItems="center" overflow="hidden">
        <Flex alignItems="center" justifyContent="center" py="4" px="4">
          <Image
            src={settings.project.logo}
            alt="Brand Logo"
            w="33px"
            height="33px"
            cursor="pointer"
            onClick={() => navigate("/dashboard")}
          />
        </Flex>

        <Box
          pos="relative"
          flexGrow={1}
          cursor="pointer"
          onClick={onMenuCollapse}
          // display={isSidebarOpen ? "block" : "none"}
          opacity={isSidebarOpen ? 1 : 0}
          transition="opacity .2s ease"
        >
          <Image
            src={ExpandMoreIcon}
            alt="expand more"
            w="25px"
            pos="absolute"
            right="25px"
            top="-12.5px" // because the img height is 30, we give it half to center vertically
            style={{
              rotate: isSidebarOpen ? "0deg" : "180deg",
            }}
          />
          <Image
            src={ExpandMoreIcon2}
            alt="expand more"
            w="25px"
            pos="absolute"
            right="17px"
            top="-12.5px"
            style={{
              rotate: isSidebarOpen ? "0deg" : "180deg",
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
}

BrandLogoRow.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  onMenuCollapse: PropTypes.func.isRequired,
};
