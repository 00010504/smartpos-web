import {
  Flex,
  Box,
  Heading,
  Text,
  Image,
  CloseButton,
  // useColorModeValue,
} from "@chakra-ui/react";
import SuccessIcon from "@/assets/success.svg";
import ErrorIcon from "@/assets/error.svg";
import InfoIcon from "@/assets/info.svg";
import PropTypes from "prop-types";

export default function Toast({ title, description, status, onClose }) {
  // description = "ASDASDASDASD";
  // const headingColor = useColorModeValue("#737373", "colors.icon");
  // const descriptionColor = useColorModeValue("#737373", "colors.icon");

  const headingColor = getColorModeValue("#737373", "colors.icon");
  const descriptionColor = getColorModeValue("#737373", "colors.icon");

  return (
    <Flex
      bg="colors.sidebar"
      boxShadow="0px 4px 20px rgb(0 0 0 / 10%)"
      rounded="lg"
      align="center"
      mr="5"
      mt="12px"
      padding="14px 18px"
      minW="350px"
    >
      {status === "success" && <Image src={SuccessIcon} alt="success" w="6" />}
      {status === "error" && <Image src={ErrorIcon} alt="error" w="6" />}
      {status === "info" && <Image src={InfoIcon} alt="info" w="6" />}
      <Box px="4" flexGrow={1}>
        <Heading pt={1} size="sm" color={headingColor}>
          {title}
        </Heading>
        <Text
          color={descriptionColor}
          maxWidth="420px"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {description}
        </Text>
      </Box>
      <CloseButton
        color="colors.pipe"
        border="1px solid var(--ck-colors-colors-sidebarBorder)"
        // borderColor="colors.sidebarBorder"
        onClick={onClose}
      />
    </Flex>
  );
}

Toast.defaultProps = {
  description: "",
  status: "error",
};

Toast.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

function getColorModeValue(light, dark) {
  const mode = localStorage.getItem("chakra-ui-color-mode");

  if (mode === "light") {
    return light;
  }

  return dark;
}
