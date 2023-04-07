import { t } from "@/utils/i18n";
import { Checkbox, Flex, Text } from "@chakra-ui/react";
import LocalStorage from "@/utils/LocalStorage";
import qs from "qs";
import { isEmpty } from "lodash";
import Image from "@/components/atoms/Image";
import TableFilterBtn from "@/components/molecules/TableFilterBtn"; /* eslint-disable no-param-reassign */
import priceFormatter from "@/helpers/priceFormatter";

const noData = (text = "no") => (
  <Text fontWeight={300} color="colors.icon">
    {t(text)}
  </Text>
);

const imgCell = (info) => (
  <Flex
    w="42px"
    h="42px"
    overflow="hidden"
    rounded="sm"
    alignItems="center"
    justifyContent="center"
    ml={1}
  >
    <Image
      styles={{
        transform: "scale(1.2)",
        objectFit: "cover",
        width: "40px",
        height: "40px",
      }}
      props={{
        src: info.getValue(),
        alt: "product photo",
      }}
    />
  </Flex>
);

export const cols = [
  "select",
  "image",
  "category",
  "price",
  "cost",
  "margin",
  "stock",
];

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        ml={1}
        isChecked={table.getIsAllRowsSelected()}
        bg="colors.checkbox"
        borderRadius="5px"
        iconColor="#fff"
        onChange={table.getToggleAllRowsSelectedHandler()}
        // aria labelledby
        aria-labelledby="select_all"
        aria-label="select_all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        ml={1}
        isChecked={row.getIsSelected()}
        bg="colors.checkbox"
        borderRadius="5px"
        iconColor="#fff"
        onChange={row.getToggleSelectedHandler()}
        aria-labelledby="select_product"
        aria-label="select_product"
      />
    ),
  },
  {
    id: "image",
    header: t("image"),
    accessorKey: "image",
    cell: imgCell,
  },
  {
    id: "product_name",
    header: t("product_name"),
    accessorKey: "name",
    cell: (info) => (
      <Text
        color="colors.link"
        fontWeight={600}
        cursor="pointer"
        onClick={() => info.table.options.meta.onClick(info.row.id)}
        marginLeft="-10px"
        className="two-lines"
        title={info.getValue()}
      >
        {info.getValue()}
      </Text>
    ),
  },
  {
    id: "category",
    header: t("category"),
    accessorFn: (row) => {
      const category = Object.values(row.categories || {})[0]?.name; // hardcoded
      return category || noData("no_category");
    },
    cell: (info) => info.getValue(),
  },
  {
    id: "price",
    header: t("price"),
    accessorFn: (row) => {
      const shopPrices = Object.values(row.shop_prices || {});
      const price = shopPrices[0]?.retail_price; // hardcoded
      return priceFormatter(price) !== "0" ? priceFormatter(price) : noData();
    },
    cell: (info) => info.getValue(),
  },
  {
    id: "cost",
    header: t("cost"),
    accessorFn: (row) => {
      const shopPrices = Object.values(row.shop_prices || {});
      const cost = shopPrices[0]?.supply_price; // hardcoded index
      return priceFormatter(cost) !== "0" ? priceFormatter(cost) : noData();
    },
    cell: (info) => info.getValue(),
  },
  {
    id: "margin",
    header: t("margin"),
    accessorFn: (row) => {
      if (!isEmpty(row.shop_prices)) {
        const shopPrices = Object.values(row.shop_prices || {});
        const retailPrice = shopPrices[0].retail_price; // hardcoded
        const supplyPrice = shopPrices[0].supply_price; // hardcoded
        const margin = (retailPrice / supplyPrice - 1) * 100;
        if (!retailPrice || !supplyPrice) return noData();
        if (
          isNaN(margin) ||
          margin === Infinity ||
          margin === -Infinity
          // ||
          // margin < 0
        ) {
          return noData();
        }
        return `${Math.round(margin)}%`;
      }
      return noData();
    },
    cell: (info) => info.getValue(),
  },
  {
    id: "stock",
    header: t("stock"),
    accessorFn: (row) => {
      const stock = Object.values(row.measurement_values || {}).reduce(
        (acc, item) => acc + item.amount,
        0,
      );
      return stock || noData();
    },
    cell: (info) => info.renderValue(),
  },
  {
    id: "filter",
    header: ({ table }) => {
      const onColumnsReorder = (colIds) => {
        const columnIds = ["select"].concat(colIds);
        table.setColumnOrder(columnIds);

        LocalStorage.set("products_table", {
          ...LocalStorage?.products_table,
          order: colIds,
        });
      };

      const onColumnVisibilityChange = (column, e) => {
        column.getToggleVisibilityHandler()(e);
        const isVisible = e.target.checked;
        const { columnOrder: colOrder } = table.getState();

        const uniqueColOrder = Array.from(new Set([...colOrder, column.id]));

        if (isVisible) {
          table.setColumnOrder(uniqueColOrder);
        }

        LocalStorage.set("products_table", {
          ...LocalStorage?.products_table,
          columnVisibility: {
            ...LocalStorage?.products_table?.columnVisibility,
            [column.id]: e.target.checked,
          },
          order: isVisible
            ? uniqueColOrder
            : colOrder.filter((id) => id !== column.id),
        });
      };

      return (
        <TableFilterBtn
          onColumnVisibilityChange={onColumnVisibilityChange}
          leafColumns={table.getAllLeafColumns()}
          onColumnsReorder={onColumnsReorder}
        />
      );
    },
  },
];

export const inputStyles = {
  margin: "0",
  marginTop: "0",
  padding: "24px 16px",
  borderRadius: "10px",
  fontWeight: "400",
  border: "1px solid #ECECEC",
  minWidth: "350px",
  width: "480px",
};

export const productsStatusOptions = ["all", "active", "inactive", "low_stock"];

const table = LocalStorage?.products_table;

const { page } = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

export const initials = {
  fetchedData: { data: [], total: 0, statistics: {} },
  columnOrder: table?.order || columns.map((c) => c.id),
  pagination: {
    pageIndex: page - 1 || 0,
    pageSize: table?.page_size || 10,
  },
  rowSelection: {},
  columnVisibility: table?.columnVisibility || {},
};
