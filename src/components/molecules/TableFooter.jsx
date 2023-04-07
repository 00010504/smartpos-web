import PropTypes from "prop-types";
import { Box, Button, Flex, Image, Select as CkSelect } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@/assets/icons/download.svg";
import Pagination from "./Pagination/Pagination";

function TableFooter({ pagination, pageSize, onDownload, leftElement }) {
  const { t } = useTranslation();

  return (
    <Box {...styles.container}>
      <Flex gap="24px">
        {onDownload !== null && (
          <Button
            leftIcon={<Image mt="-1px" src={DownloadIcon} alt="download" />}
            colorScheme="white"
            fontWeight="500"
            border="1px solid"
            borderColor="colors.sidebarBorder"
            color="colors.icon2"
            gap="3px"
            fontSize="14px"
            padding="8px 15px"
            onClick={onDownload}
          >
            {t("download")}
          </Button>
        )}
        {leftElement}
      </Flex>
      <Flex alignItems="center">
        <Pagination
          total={pagination.total}
          current={pagination.current}
          onChange={pagination.onChange}
          pageSize={pageSize.value}
        />
        <CkSelect
          marginLeft={5}
          width={20}
          background="colors.grayF9"
          border="none"
          onChange={pageSize.onChange}
          value={pageSize.value}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </CkSelect>
      </Flex>
    </Box>
  );
}

export default TableFooter;

TableFooter.defaultProps = {
  onDownload: null,
  leftElement: null,
};

TableFooter.propTypes = {
  pagination: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    current: PropTypes.number,
    onChange: PropTypes.func,
  }).isRequired,
  pageSize: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.number,
  }).isRequired,
  onDownload: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
  leftElement: PropTypes.node,
};

const styles = {
  container: {
    padding: "25px 0",
    paddingBottom: 0,
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid",
    borderColor: "colors.grayF9",
    gap: "15px",
    alignItems: "center",
  },
};
