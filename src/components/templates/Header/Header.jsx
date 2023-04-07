import { Flex, Badge, Box, Input, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useImportValidationContext } from "@/contexts/importValidationContext";
import { useColorModeContext } from "@/contexts/colorModeContext";
import ImportValidationProgress from "@/components/organisms/ImportValidationProgress";
import MailIcon from "@/components/atoms/Icons/Mail";
import HelpIcon from "@/components/atoms/Icons/Help";
import SearchIcon from "@/components/atoms/Icons/SearchIcon";
import styles from "./styles";
import Avatar from "./Avatar";
import Notifications from "./Notifications";

function Header() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { setColorMode } = useColorModeContext();

  const changeColorMode = () => {
    toggleColorMode();
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const {
    importValidation: {
      percentage,
      hasUploaded,
      filename,
      bytesUploaded,
      bytesTotal,
      remainingTime,
      hasValidationStarted,
    },
    setImportValidation,
  } = useImportValidationContext();

  useEffect(() => {
    setImportValidation((prev) => ({
      ...prev,
      filename: "Import_table.xlsx",
      hasUploaded: false,
      bytesTotal: 1000000,
    }));
  }, [setImportValidation]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImportValidation((prev) => ({
        ...prev,
        percentage: prev.percentage + 10,
        bytesUploaded: prev.bytesUploaded + 10000,
        remainingTime: 1000,
      }));
      clearTimeout(timeout);
    }, 1000);
  }, [setImportValidation]);

  return (
    <Flex {...styles.container}>
      <Flex {...styles.search_input_wrapper}>
        <SearchIcon mr="2px" mt="2px" color="colors.placeholder" />
        <Input placeholder="Search" {...styles.search_input} />
      </Flex>
      <Flex gap="30px" alignItems="center">
        <Flex gap="30px" alignItems="center" pt="2px">
          {colorMode === "light" ? (
            <SunIcon
              color="colors.icon2"
              fontSize="20px"
              cursor="pointer"
              onClick={changeColorMode}
            />
          ) : (
            <MoonIcon
              fontSize="20px"
              cursor="pointer"
              color="colors.icon2"
              onClick={changeColorMode}
            />
          )}
          <Box {...styles.icon_wrapper}>
            <MailIcon {...styles.icon} color="colors.icon2" />
            <Badge {...styles.icon_badge} backgroundColor="#FF4B4B">
              5
            </Badge>
          </Box>
          <Notifications />
          <Box {...styles.icon_wrapper}>
            <HelpIcon {...styles.icon} color="colors.icon2" />
          </Box>
        </Flex>
        <Avatar />
        {hasValidationStarted ? (
          <ImportValidationProgress
            filename={filename}
            hasUploaded={hasUploaded}
            percentage={percentage}
            bytesUploaded={bytesUploaded}
            bytesTotal={bytesTotal}
            remainingTime={remainingTime}
          />
        ) : null}
      </Flex>
    </Flex>
  );
}

export default Header;
