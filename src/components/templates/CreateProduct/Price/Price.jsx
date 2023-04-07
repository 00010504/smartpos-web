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
import useHideData from "@/hooks/useHideData";
import { SEE_PRODUCT_PURCHASE_COSTS } from "@/constants/permissions";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import PriceRow from "./PriceRow";
import { tableStyles, priceTableHeaders as _priceTableHeaders } from "../data";

function RemainsPrice({ shopPrices, control, errors, setValue, watch, refs }) {
  const { t } = useTranslation();
  const [priceTableHeaders] = useHideData({
    permission: SEE_PRODUCT_PURCHASE_COSTS,
    collection: [_priceTableHeaders],
    accessorKey: "value",
    match: "supply_price",
  });

  return (
    <Box as="section" pos="relative">
      <VisuallyHidden
        id="price"
        height="150px"
        pos="absolute"
        top="-72px"
        ref={refs[1]}
      />
      <Box pt={12}>
        <SectionHeader title={t("price")} />
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
                {shopPrices.map((row, index) => (
                  <PriceRow
                    key={`prices_${row.shop_id}`}
                    index={index}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

RemainsPrice.defaultProps = {
  shopPrices: [],
};

RemainsPrice.propTypes = {
  shopPrices: PropTypes.arrayOf(
    PropTypes.shape({
      shop_id: PropTypes.string,
      title: PropTypes.string,
      supply_price: PropTypes.string,
      margin: PropTypes.string,
      retail_price: PropTypes.string,
    }),
  ),
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  refs: PropTypes.arrayOf(
    PropTypes.exact({ current: PropTypes.instanceOf(Element) }),
  ).isRequired,
};

export default RemainsPrice;
