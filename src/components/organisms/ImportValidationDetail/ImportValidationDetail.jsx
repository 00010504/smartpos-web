import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CustomSwitch from "@/components/molecules/CustomSwitch";
import { tableHeadings, tableStyles } from "./data";

function Row({ index, style, data }) {
  if (!data[index]) return null;

  const { message, row } = data[index];

  return (
    <Flex
      {...style}
      alignItems="center"
      rounded="xl"
      bg={index % 2 === 0 ? "#f9f9f9" : null}
      p="4"
    >
      <span className="tabular-nums w-[75px] text-[#050929] text-sm">
        {row}
      </span>
      <Box as="span" {...tableHeadings.td} flexGrow={1}>
        {message}
      </Box>
    </Flex>
  );
}

function ImportValidationDetail({
  validationErrors,
  errorItemsCount,
  successItemsCount,
}) {
  const [successfull, setSuccessfull] = useState(false);
  const { t } = useTranslation();

  return (
    <Box>
      <CustomSwitch
        active={successfull}
        onChange={setSuccessfull}
        options={[
          {
            label: `${t("not_successfull")} (${errorItemsCount})`,
            value: false,
          },
          {
            label: `${t("successfull")} (${successItemsCount})`,
            value: true,
          },
        ]}
      />
      <Box {...tableStyles.thead}>
        {Object.values(tableHeadings).map((header) => (
          <Box key={header} {...tableStyles.th}>
            {t(header)}
          </Box>
        ))}
      </Box>
      <Box height="355px" overflow="auto">
        {!successfull && (
          <List
            itemData={validationErrors}
            height={330}
            itemCount={validationErrors.length}
            itemSize={50}
            width="100%"
            style={{ marginTop: "24px" }}
          >
            {Row}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default ImportValidationDetail;

Row.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.exact({
      message: PropTypes.string,
      row: PropTypes.number,
    }),
  ).isRequired,
};

ImportValidationDetail.defaultProps = {
  validationErrors: [],
  errorItemsCount: 0,
  successItemsCount: 0,
};

ImportValidationDetail.propTypes = {
  validationErrors: PropTypes.arrayOf(PropTypes.shape({})),
  errorItemsCount: PropTypes.number,
  successItemsCount: PropTypes.number,
};
