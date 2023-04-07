/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useMemo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getSupplierOrderQuery } from "@/queries";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  deleteSupplierOrder,
  finishSupplierOrder,
  supplierOrderExcel,
} from "@/services";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  TableContainer,
  Image,
} from "@chakra-ui/react";
import useToast from "@/hooks/useToast";
import useRowId from "@/hooks/useRowId";
import { debounce } from "lodash";
import qs from "qs";
import LocalStorage from "@/utils/LocalStorage";
import getDateRange from "@/helpers/getDateRange";
import FilterIcon from "@/assets/images/icons/filter.svg";
import DeleteIcon2 from "@/assets/images/icons/delete.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import DeleteModal from "@/components/molecules/DeleteModal";
import Search from "@/components/molecules/Input/Search";
import TableFooter from "@/components/molecules/TableFooter";
import CreateOrderFormDrawer from "./CreateSupplierOrderForm";
import {
  css,
  columns,
  initials,
} from "./data"; /* eslint-disable no-nested-ternary */
import SupplierFilters from "./SupplierOrderFilters";

const { date_from, date_to } = getDateRange("year");

const initialParams = {
  search: "",
  limit: "10",
  page: "1",
  start_date: date_from.toISOString(),
  end_date: date_to.toISOString(),
  status: "",
};

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  ...initialParams,
  ...parsed,
};

export default function OrdersTable() {
  const searchRef = useRef(null);
  const [showFilter, setShowFilter] = useState();
  const [supplierOrder, setSupplierOrder] = useState(null);
  const ref = useRef(null);
  const [pagination, setPagination] = useState(initials.pagination);
  const [rowSelection, setRowSelection] = useState(initials.rowSelection);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [rowState, clearRowState] = useRowId(ref);
  const [recieveLoading, setRecieveLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: queryData } = useQuery({
    ...getSupplierOrderQuery(params),
    keepPreviousData: true,
    onError: (res) => {
      addToast({ title: "Error", description: res.data?.error });
    },
  });

  const { mutate } = useMutation(deleteSupplierOrder, {
    onSuccess: (id) => {
      queryClient.invalidateQueries(["supplier-orders"]);
      queryClient.removeQueries(["supplier-orders", id]);
      addToast({ title: "Supplier Order deleted!", status: "success" });
    },
    onError: (error) => {
      addToast({ title: error.data.message });
    },
  });

  const onCompleteOrder = (id) => {
    setRecieveLoading(true);
    finishSupplierOrder(id).then(() => {
      queryClient.invalidateQueries(["supplier-orders"]);
      queryClient.removeQueries(["supplier-order", id]);
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      addToast({ title: "Supplier Order completed!", status: "success" });
      setRecieveLoading(false);
    });
  };

  const getSupplierOrderExcel = (id) => {
    supplierOrderExcel(id).then((res) => {
      const link = document.createElement("a");
      link.href = res.id;
      link.setAttribute("download", "example.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  const { data, total } = { ...initials.fetchedData, ...queryData };

  const table = useReactTable({
    data,
    columns,
    autoResetSelectedRows: false,
    getRowId: (order) => order.id,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: {
      rowSelection,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    meta: {
      onRowClick: (rowId) => navigate(`/products/orders/edit-order/${rowId}`),
      onRowComplete: (rowId) => onCompleteOrder(rowId),
      onDownload: getSupplierOrderExcel,
      loading: recieveLoading,
    },
  });

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const range = { date_from, date_to };

  const onOrderSearchChange = (search) => {
    params = { ...params, search };
    return debouncedSearch(params);
  };

  const handleDelete = () => {
    const ids = Object.keys(rowSelection);

    const body = {
      ids,
    };

    ids.forEach((id) => {
      queryClient.removeQueries(["supplier-orders", id]);
    });

    mutate(body);

    setRowSelection({});
  };

  const changeParams = (payload) => {
    params = payload;
    setSearchParams(params);
  };

  const onPageChange = (page) => {
    table.setPageIndex(page - 1);
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const onPageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    table.setPageSize(newPageSize);
    params = { ...params, limit: String(newPageSize) };
    setSearchParams(params);
    LocalStorage.set("orders_table", {
      ...LocalStorage?.orders_table,
      page_size: newPageSize,
    });
  };

  useEffect(() => {
    const inputValue = searchParams.get("search");
    if (inputValue) {
      searchRef.current.value = inputValue;
    }
  }, [searchParams]);

  // useEffect(() => {
  //   setSearchParams(params);
  // }, []);

  return (
    <>
      <Flex
        mt={-4}
        marginBottom={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap="20px">
          <Search
            ref={searchRef}
            inputProps={css.inputStyles}
            search={{
              onChange: onOrderSearchChange,
            }}
            placeholder={t("search")}
          />
          <Box position="relative">
            <IconButton
              {...css.filterButton}
              onClick={() => {
                if (Object.keys(params).length - 3 > 0) {
                  params = initialParams;
                  setSearchParams(params);
                }
                setShowFilter(!showFilter);
              }}
              icon={
                showFilter ? (
                  <Image width="48px" src={DeleteIcon} alt="Close" />
                ) : (
                  <Image
                    borderRadius="12px"
                    width="48px"
                    src={FilterIcon}
                    alt="Filter"
                  />
                )
              }
              borderRadius="10px"
            />
            {Object.keys(rowSelection)?.length > 0 && (
              <IconButton
                ml={5}
                marginTop={3}
                height="50px"
                width="52px"
                aria-label="Delete products"
                icon={<Image width="18px" src={DeleteIcon2} alt="delete" />}
                borderRadius="10px"
                bg="rgba(239, 68, 68, 0.1)"
                colorScheme="gray"
                _hover={{
                  bg: "rgba(239, 68, 68, 0.2)",
                }}
                onClick={handleDelete}
              />
            )}
          </Box>
        </Box>
        <Button
          height="45px"
          width="100px"
          borderRadius="10px"
          mt={3}
          color="#fff"
          pt="2px"
          onClick={() => setSupplierOrder(true)}
        >
          {t("create")}
        </Button>
        <CreateOrderFormDrawer
          isOpen={!!supplierOrder}
          onClose={() => setSupplierOrder(null)}
        />
      </Flex>
      {/* <Collapse in={showFilter}> */}
      {showFilter && (
        <SupplierFilters
          params={params}
          changeParams={changeParams}
          setSearchParams={setSearchParams}
          range={range}
        />
      )}
      {/* </Collapse> */}

      <TableContainer>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} {...css.th}>
                    {header.isPlaceholder
                      ? null
                      : typeof flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        ) === "string"
                      ? t(
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          ),
                        )
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody ref={ref}>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id} data-row-id={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} border="none">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <TableFooter
        pagination={{
          total,
          current: pagination.pageIndex >= 0 ? pagination.pageIndex + 1 : 1,
          onChange: onPageChange,
        }}
        pageSize={{
          value: pagination.pageSize,
          onChange: onPageSizeChange,
        }}
      />
      <DeleteModal
        isOpen={rowState.action === "delete" && rowState.id !== null}
        onDelete={() => handleDelete(rowState.id)}
        onClose={clearRowState}
        title={t("are_you_sure_want_to_delete")}
        description={t("you_cant_restore_after_delete")}
      />
    </>
  );
}
