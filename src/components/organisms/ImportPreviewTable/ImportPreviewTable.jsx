import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Table, Tr, Tbody, Td, Thead, Th } from "@chakra-ui/react";
import TableFooter from "@/components/molecules/TableFooter";
import priceFormatter from "@/helpers/priceFormatter";
import { tableHeadings, tableStyles } from "./data";

function ImportPreviewTable({ items, searchParams, changePage, changeLimit }) {
  const { t } = useTranslation();

  return (
    <>
      <Table>
        <Thead {...tableStyles.thead} borderRadius="10px" overflow="hidden">
          <Tr>
            {tableHeadings.map((header) => (
              <Th key={header} {...tableStyles.th}>
                {t(header)}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {items?.data?.map((row) => (
            <Tr key={row.id}>
              <Td {...tableStyles.td}>{row.name}</Td>
              <Td {...tableStyles.td}>{row.sku}</Td>{" "}
              <Td {...tableStyles.td}>{row.quantity}</Td>
              <Td {...tableStyles.td}>
                {row.supply_price && priceFormatter(row.supply_price)}{" "}
                {t("sum")}
              </Td>
              <Td {...tableStyles.td}>
                {row.sale_price && priceFormatter(row.sale_price)} {t("sum")}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <TableFooter
        pagination={{
          total: items?.total_count || 1,
          current: +searchParams.get("page"),
          onChange: changePage,
        }}
        pageSize={{
          value: +searchParams.get("limit"),
          onChange: changeLimit,
        }}
      />
    </>
  );
}

export default ImportPreviewTable;

ImportPreviewTable.propTypes = {
  items: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({})),
    total_count: PropTypes.number,
  }).isRequired,
  searchParams: PropTypes.instanceOf(URLSearchParams).isRequired,
  changePage: PropTypes.func.isRequired,
  changeLimit: PropTypes.func.isRequired,
};
