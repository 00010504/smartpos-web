import { useTranslation } from "react-i18next";
import { Box, Heading } from "@chakra-ui/react";
import PropTypes from "prop-types";
import styles from "./SectionHeader.module.css";

function SectionHeader({ title }) {
  const { t } = useTranslation();

  return (
    <Heading className={styles.section_header} fontSize="22px" w="100%">
      <Box as="span" background="colors.body !important">
        {t(title)}
      </Box>
    </Heading>
  );
}

export default SectionHeader;

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};
