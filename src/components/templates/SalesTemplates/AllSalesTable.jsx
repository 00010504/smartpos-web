import { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Table, Tr, Thead, Tbody, Th, Td } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { tableHeaders, tableStyles } from "./data";

export default function AllSalesTable({ sales, setSaleId }) {
  const ref = useRef(null);
  const { t } = useTranslation();

  return (
    <Table marginTop="25px">
      <Thead {...tableStyles.thead}>
        <Tr>
          {Object.values(tableHeaders).map((header) => (
            <Th {...tableStyles.th} key={header}>
              {t(header)}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody ref={ref}>
        {sales?.map((sale) => (
          <Tr key={sale.id}>
            <Td
              {...tableStyles.td}
              color="colors.link"
              fontWeight={700}
              cursor="pointer"
              onClick={() => setSaleId(sale.id)}
            >
              Sale #{sale.external_id}
            </Td>
            <Td {...tableStyles.td}>{sale.shop.title}</Td>
            <Td {...tableStyles.td}>
              {sale?.create_time &&
                format(parseISO(sale?.create_time), "dd.MM.yyyy | HH:mm:ss")}
            </Td>
            <Td {...tableStyles.td}>{sale?.product_sort_count || 0}</Td>
            <Td {...tableStyles.td}>{sale?.total_pirce || 0}</Td>
            <Td {...tableStyles.td}>
              {sale.created_by.first_name} {sale.created_by.last_name}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

AllSalesTable.propTypes = {
  sales: PropTypes.arrayOf(
    PropTypes.shape({
      external_id: PropTypes.string,
    }),
  ).isRequired,
  setSaleId: PropTypes.func.isRequired,
};

export const inputStyles = {
  margin: "10px auto",
  marginTop: "20px",
  padding: "24px 16px",
  borderRadius: "10px",
  fontWeight: "500",
  border: "1px solid #ECECEC",
  color: "#000",
  minWidth: "350px",
  width: "480px",
};
