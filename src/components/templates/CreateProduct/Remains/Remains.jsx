import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  VisuallyHidden,
} from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import { tableStyles } from "../data";
import RemainsRow from "./RemainsRow";

const priceTableHeaders = [
  {
    label: "available",
    value: "is_available",
    width: "50px",
  },
  {
    label: "store",
    value: "store_name",
    width: "50px",
  },
  {
    label: "stock",
    value: "stock",
    width: "150px",
  },
  {
    label: "low_stock",
    value: "low_stock",
    width: "150px",
  },
];

function Remains({ measurementValues, control, errors, getValues, refs }) {
  const { t } = useTranslation();

  return (
    <Box as="section" pos="relative">
      <VisuallyHidden
        id="remains"
        height="150px"
        pos="absolute"
        top="-72px"
        ref={refs[2]}
      />

      <Box pt={12}>
        <SectionHeader title={t("remains")} />
        <Box>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  {priceTableHeaders.map((header) => (
                    <Th
                      {...tableStyles.td}
                      {...tableStyles.th}
                      key={header.label}
                      width={header.width}
                    >
                      {t(header.label)}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {measurementValues.map((row, index) => {
                  return (
                    <RemainsRow
                      key={`remains_${row.shop_id}`}
                      title={row.title || row.shop_name}
                      index={index}
                      control={control}
                      errors={errors}
                      getValues={getValues}
                    />
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

Remains.defaultProps = {
  measurementValues: [],
};

Remains.propTypes = {
  measurementValues: PropTypes.arrayOf(
    PropTypes.shape({
      shop_id: PropTypes.string,
      title: PropTypes.string,
      amount: PropTypes.string,
      small_left: PropTypes.string,
    }),
  ),
  getValues: PropTypes.func.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  refs: PropTypes.arrayOf(
    PropTypes.exact({ current: PropTypes.instanceOf(Element) }),
  ).isRequired,
};

export default Remains;
