import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import LocalStorage from "@/utils/LocalStorage";
import { format, parseISO } from "date-fns";
import qs from "qs";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import CheckIcon from "@/assets/images/icons/check.svg";
import { ViewIcon } from "@chakra-ui/icons";
import DownloadIcon from "@/components/atoms/Icons/Download";
import { t } from "@/utils/i18n";

export const css = {
  inputStyles: {
    margin: "10px auto",
    marginTop: "20px",
    padding: "24px 16px",
    borderRadius: "10px",
    fontWeight: "400",
    border: "1px solid #ECECEC",
    minWidth: "350px",
    width: "480px",
  },
  th: {
    color: "grey.800",
    textTransform: "none",
    fontWeight: "600",
    padding: "20px 20px",
    fontSize: "15px",
    border: "none !important",
  },
  td: { borderBottom: "none", pb: "30px" },
  grid: {
    my: "30px",
    p: "12px 24px",
    border: "1px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "5px",
    columns: 2,
    gap: "7px 100px",
  },
  textFlex: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    bg: "colors.body",
    borderRadius: "5px",
    border: "1px solid",
    borderColor: "colors.sidebarBorder",
  },
  filterButton: {
    marginTop: 3,
    height: "45px",
    width: "48px",
    "aria-label": "Filter",
    variant: "ghost",
    colorScheme: "gray",
    size: "sm",
  },
};

export const types = [
  {
    value: "4c60818f-29be-45df-9860-c7f2fe94d91d",
    label: "Order",
  },
  {
    value: "4d990284-425b-4602-ab65-ebd8436b3ebd",
    label: "Return",
  },
];

const stats = {
  Cancelled: "red",
  Recieved: "green",
  Proccess: "yellow",
  Ordered: "blue",
};

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
      />
    ),
  },
  {
    id: "supplier_name",
    header: "supplier_name",
    accessorKey: "supplier_name.name",
    cell: (info) => (
      <Text color="colors.link" fontWeight={600}>
        {info.getValue()}
      </Text>
    ),
  },
  {
    id: "order_id",
    header: "order_id",
    accessorKey: "external_id",
  },
  {
    id: "employee",
    header: "employee",
    accessorKey: "user.first_name",
  },
  {
    id: "branch",
    header: "branch",
    accessorKey: "shop.name",
  },
  {
    id: "status",
    header: "status",
    accessorKey: "status.name",
    cell: (info) => {
      const currStat = info.getValue();
      return (
        <Tag p="8px 12px" colorScheme={stats[currStat] || "gray"}>
          {t(currStat.toLowerCase())}
        </Tag>
      );
    },
  },
  {
    id: "expected_on",
    header: "expected_on",
    accessorKey: "expected_date",
    cell: (info) => format(parseISO(info.getValue()), "dd.MM.yyyy"),
  },
  {
    id: "amount",
    header: "amount",
    accessorKey: "total_amount",
  },
  {
    id: "actions",
    header: "actions",
    cell: (info) => (
      <Flex alignItems="center" gap="5px">
        {info.row.original.status.name === "Recieved" && (
          <IconButton
            data-action="edit"
            colorScheme="gray"
            size="sm"
            onClick={() => info.table.options.meta.onRowClick(info.row.id)}
          >
            <ViewIcon width="16px" height="16px" />
          </IconButton>
        )}
        {info.row.original.status.name === "Recieved" && (
          <IconButton
            data-action="download"
            colorScheme="gray"
            size="sm"
            onClick={() => info.table.options.meta.onDownload(info.row.id)}
          >
            <DownloadIcon
              fill="colors.headingColor"
              width="18px"
              height="18px"
            />
          </IconButton>
        )}
        {info.row.original.status.name !== "Recieved" && (
          <Button data-action="edit" variant="link">
            <Image
              width="30px"
              src={EditIcon}
              alt="Edit"
              onClick={() => info.table.options.meta.onRowClick(info.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Button>
        )}
        <Button data-action="delete" variant="link">
          <Image
            aria-hidden
            width="30px"
            src={DeleteIcon}
            alt="Delete"
            style={{ cursor: "pointer" }}
          />
        </Button>
        {info.row.original.status.name === "Ordered" &&
          info.row.original.total_amount > 0 && (
            <IconButton
              size="sm"
              p="0"
              colorScheme="green"
              data-action="complete"
              ml="5px"
              isLoading={info.table.options.meta.is_loading}
            >
              <Image
                width="20px"
                src={CheckIcon}
                alt="Edit"
                onClick={() =>
                  info.table.options.meta.onRowComplete(info.row.id)
                }
                style={{ cursor: "pointer" }}
              />
            </IconButton>
          )}
      </Flex>
    ),
  },
];

const table = LocalStorage?.orders_table;

const { page } = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

export const initials = {
  fetchedData: { data: [], total: 0, statistics: {} },
  pagination: {
    pageIndex: page - 1 || 0,
    pageSize: table?.page_size || 10,
  },
  rowSelection: {},
};

export const productsHeadings = [
  "order_number",
  "name",
  "barcode",
  "quantity",
  "price",
  "discount",
  "total",
  "actions",
];

export const supplierOrderStatusOptions = [
  {
    value: "",
    label: t("all"),
  },
  {
    value: "b4e0db85-3a80-414f-abe2-421c6334b9d0",
    label: t("pending"),
  },
  {
    value: "f963a201-b8dd-4f52-b4a4-070041a0ed42",
    label: t("new"),
  },
  {
    value: "973f4626-d0a3-4693-95a6-eb65e87b3a76",
    label: t("ordered"),
  },
  {
    value: "042781b6-9ed1-4cec-94ec-4ed4009117a3",
    label: t("canceled"),
  },
  {
    value: "caba1cc0-ba0d-4a03-8b78-c81c6730cca6",
    label: t("recieved"),
  },
];
