import { Flex, SimpleGrid } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function FormStep({ firstCol, secondCol, row }) {
  return (
    <Flex as="section" direction="column" gap="15px" p="1">
      {firstCol || secondCol ? (
        <SimpleGrid columns={2} gap="35px">
          <Flex direction="column" gap={6}>
            {firstCol}
          </Flex>
          <Flex direction="column" gap={6}>
            {secondCol}
          </Flex>
        </SimpleGrid>
      ) : null}
      {row}
    </Flex>
  );
}

FormStep.defaultProps = {
  firstCol: null,
  secondCol: null,
  row: null,
};

FormStep.propTypes = {
  firstCol: PropTypes.arrayOf(PropTypes.element),
  secondCol: PropTypes.arrayOf(PropTypes.element),
  row: PropTypes.element,
};
