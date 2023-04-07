import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Fade,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CompleteIcon from "@/assets/import-validation-complete.svg";
import ProcessChart from "./ProcessChart";

function ImportValidationProcess({ process }) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  return (
    <SimpleGrid gridTemplateColumns="1fr 1fr" {...styles.container}>
      <Box
        {...styles.box}
        borderRight="2px dashed"
        borderColor="colors.sidebarBorder"
      >
        <Heading size="md" fontWeight={400} fontSize="24px">
          {t("we_will_notify_you")}
        </Heading>
        <Text
          lineHeight="1.4"
          mt={4}
          fontSize="14px"
          color="colors.text"
          opacity="0.5"
        >
          {t("we_will_notify_you_text")}
        </Text>
        <Button
          marginTop="auto"
          fontWeight={400}
          padding="13px 26px"
          height="45px"
          color="#fff"
          onClick={() => navigate("/products/import")}
        >
          {t("go_to_main_page")}
        </Button>
      </Box>
      <Box {...styles.box} textAlign="center" position="relative">
        <Heading size="lg">{t("file_validation")}</Heading>
        <Box
          bg="#fff"
          borderRadius="50%"
          width="156px"
          height="156px"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="100%"
          height={300}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {process >= 100 ? (
            <Fade in>
              <Image width="170px" src={CompleteIcon} alt="" />
            </Fade>
          ) : (
            <ProcessChart percentage={process} />
          )}
        </Box>
        {/* <Text
          position="absolute"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          fontSize="14px"
          color={process >= 100 ? "#6FCF97" : "#256DF6"}
        >
          {process >= 100 ? "File validaded" : `${3} sec`}
        </Text> */}
      </Box>
    </SimpleGrid>
  );
}

export default ImportValidationProcess;

ImportValidationProcess.propTypes = {
  process: PropTypes.number.isRequired,
};

const styles = {
  container: {
    padding: "12px",
    backgroundColor: "colors.grayF9",
    borderRadius: "10px",
  },
  box: {
    padding: "15px",
    color: "#454545",
    display: "flex",
    flexDirection: "column",
  },
};
