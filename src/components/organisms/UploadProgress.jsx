import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import uploadSuccessIcon from "@/assets/file_upload_success.svg";

export default function UploadProgress({
  filename,
  hasUploaded,
  bytesUploadedRef,
  remainingTimeRef,
  percentage,
}) {
  const { t } = useTranslation();

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      height="75px"
      bg="colors.sidebar"
      p="4"
      rounded="lg"
    >
      <Flex justifyContent="center" alignItems="center">
        <Flex
          width="48px"
          height="48px"
          flexShrink={0}
          justifyContent="center"
          alignItems="center"
        >
          {hasUploaded ? (
            <Image src={uploadSuccessIcon} alt="upload success" />
          ) : (
            <CircularProgress color="brand.500" value={percentage}>
              <CircularProgressLabel
                bg="#fff"
                rounded="full"
                height="75%"
                w="75%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="brand.500"
                fontSize="sm"
              >
                {percentage}%
              </CircularProgressLabel>
            </CircularProgress>
          )}
        </Flex>
        <Box px="4">
          <Heading size="sm" noOfLines={1}>
            {filename}
          </Heading>
          <Text ref={bytesUploadedRef} fontSize="sm" color="colors.text" />
        </Box>
      </Flex>
      {hasUploaded ? (
        <Text
          color={hasUploaded ? "green.400" : "brand.500"}
          whiteSpace="nowrap"
        >
          {t("file_uploaded")}
        </Text>
      ) : (
        <Text
          ref={remainingTimeRef}
          color={hasUploaded ? "green.400" : "brand.500"}
          whiteSpace="nowrap"
          width="51px"
          className="tabular-nums"
          flexShrink={0}
        />
      )}
    </Flex>
  );
}

UploadProgress.propTypes = {
  filename: PropTypes.string.isRequired,
  hasUploaded: PropTypes.bool.isRequired,
  bytesUploadedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  remainingTimeRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  percentage: PropTypes.number.isRequired,
};
