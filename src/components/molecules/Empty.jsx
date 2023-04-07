import { Center, Image, Text, VStack } from "@chakra-ui/react";
import notFound from "@/assets/images/data-not-found.svg";
import { t } from "i18next";
import PropTypes from "prop-types";

export default function Empty({ title }) {
  return (
    <Center
      w="100%"
      h="350px"
      border="1px dashed"
      borderColor="colors.sidebarBorder"
      borderRadius="md"
    >
      <VStack>
        <Image src={notFound} width="100px" />
        <Text as="b" fontSize="2xl" color="colors.text">
          {t(title)}
        </Text>
      </VStack>
    </Center>
  );
}

Empty.propTypes = {
  title: PropTypes.string.isRequired,
};
