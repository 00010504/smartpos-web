import { useState } from "react";
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import uploadSuccessIcon from "@/assets/file_upload_success.svg";
import formatSeconds from "@/helpers/formatSeconds";
import formatBytes from "@/helpers/formatBytes";

export default function ImportValidationProgress({
  filename,
  hasUploaded,
  percentage,
  bytesUploaded,
  bytesTotal,
  remainingTime,
}) {
  const [hovering, setHovering] = useState(true);

  return (
    <Flex
      bg={hovering ? "#eef3fe" : "transparent"}
      transition="background-color 0.2s ease-out"
      rounded="lg"
      p="2"
      h="51px"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, width: "0px" },
          visible: { opacity: 1, width: "200px" },
        }}
        animate={hovering ? "visible" : "hidden"}
        initial={{
          width: "200px",
        }}
        transition={{
          duration: 0.2,
          spring: {
            damping: 100,
            stiffness: 100,
          },
        }}
      >
        <Flex
          flexDir="column"
          justifyContent="space-between"
          h="100%"
          overflow="hidden"
          mr="4"
        >
          <Heading size="sm" lineHeight={1} noOfLines={1}>
            {filename}
          </Heading>
          <Flex justifyContent="space-between" alignItems="center">
            <Text
              fontSize="0.7rem"
              fontWeight="bold"
              color="blackAlpha.400"
              flexShrink={0}
            >
              {formatBytes(bytesUploaded)} of {formatBytes(bytesTotal)}
            </Text>
            <Text
              fontSize="0.7rem"
              fontWeight="bold"
              color="brand.500"
              flexShrink={0}
            >
              {formatSeconds(remainingTime)}
            </Text>
          </Flex>
        </Flex>
      </motion.div>

      <Flex justifyContent="center" alignItems="center">
        {hasUploaded ? (
          <Image
            src={uploadSuccessIcon}
            alt="upload success"
            w="35px"
            h="100%"
          />
        ) : (
          <CircularProgress
            color={hovering ? "green.300" : "brand.500"}
            value={percentage}
            size="35px"
          >
            <CircularProgressLabel
              bg="#fff"
              rounded="full"
              h="75%"
              w="75%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color={hovering ? "black" : "brand.500"}
              fontSize="0.7rem"
            >
              {percentage}%
            </CircularProgressLabel>
          </CircularProgress>
        )}
      </Flex>
    </Flex>
  );
}

ImportValidationProgress.propTypes = {
  filename: PropTypes.string.isRequired,
  hasUploaded: PropTypes.bool.isRequired,
  percentage: PropTypes.number.isRequired,
  bytesUploaded: PropTypes.number.isRequired,
  bytesTotal: PropTypes.number.isRequired,
  remainingTime: PropTypes.number.isRequired,
};
