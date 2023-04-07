import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductsQuery } from "@/queries";
import {
  Fade,
  Button,
  Flex,
  IconButton,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { debounce } from "lodash";
import qs from "qs";
import Can from "@/hoc/Can";
import LocalStorage from "@/utils/LocalStorage";
import useToast from "@/hooks/useToast";
import useSection from "@/hooks/useSection";
import useHideData from "@/hooks/useHideData";
import { deleteProducts } from "@/services";
import "react-lazy-load-image-component/src/effects/blur.css";
import getStyleVal from "@/helpers/getStyleVal";
import {
  CREATE,
  DELETE,
  SEE_PRODUCT_PURCHASE_COSTS,
} from "@/constants/permissions";
import PropTypes from "prop-types";
import Search from "@/components/molecules/Input/Search";
import ProductsStatus from "@/components/atoms/ProductsStatus";
import FilterIcon from "@/components/atoms/Icons/Filter";
import TableFooter from "@/components/molecules/TableFooter";
import TableColumn from "@/components/molecules/TableColumn/TableColumn";
import ColumnResizer from "@/components/molecules/TableColumn/ColumnResizer";
import DeleteIcon from "@/assets/images/icons/delete.svg";
import DownloadScales from "@/components/organisms/DownloadScales/DownloadScales";
import TableFilter from "@/components/organisms/TableFilter";
import DownloadIcon from "@/components/atoms/Icons/Download";
import DownloadProducts from "@/components/organisms/DownloadProducts";
import {
  inputStyles,
  productsStatusOptions,
  columns as _columns,
  initials,
  cols as _cols,
} from "./data";

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  active_for_sale: "all",
  search: "",
  limit: String(LocalStorage?.products_table?.page_size || 10),
  page: "1",
  ...parsed,
};

export default function ProductsTable({ setProductView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const section = useSection();
  const {
    isOpen: isDrawerOpen,
    onClose: closeDrawer,
    onOpen: openDrawer,
  } = useDisclosure();

  const {
    isOpen: isExcelDownloadModalOpen,
    onClose: closeExcelDownloadModal,
    onOpen: openExcelDownloadModal,
  } = useDisclosure();

  const [columns, cols] = useHideData({
    permission: SEE_PRODUCT_PURCHASE_COSTS,
    collection: [_columns, _cols],
    accessorKey: "id",
    match: "cost",
  });

  const [pagination, setPagination] = useState(initials.pagination);
  const [rowSelection, setRowSelection] = useState(initials.rowSelection);
  const [columnOrder, setColumnOrder] = useState(initials.columnOrder);
  const [columnVisibility, setColumnVisibility] = useState(
    initials.columnVisibility,
  );
  const searchRef = useRef(null);

  const { data: queryData } = useQuery({
    ...getProductsQuery(params),
    keepPreviousData: true,
    onError: (res) => {
      addToast({ title: "Error", description: res.data?.error });
    },
  });

  const { mutate } = useMutation(deleteProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      addToast({
        title: `${t("product")} ${t("deleted_successfully")}`,
        status: "success",
      });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const { data, total } = { ...initials.fetchedData, ...queryData };
  const rowSelected = Object.keys(rowSelection)?.length > 0;

  const table = useReactTable({
    data,
    columns,
    autoResetSelectedRows: false,
    getRowId: (row) => row.id,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: {
      rowSelection,
      pagination,
      columnOrder,
      columnVisibility,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    meta: {
      onClick: (id) => setProductView(id),
    },
  });

  const onDragEnd = ({ source, destination }) => {
    if (!destination || !source) return;
    if (destination.index === source.index) return;

    const { columnOrder: tableColOrder, columnVisibility: colVisibility } =
      table.getState();
    const hiddenCols = Object.keys(colVisibility).filter(
      (col) => !colVisibility[col],
    );
    const newColumnOrder = [...tableColOrder].filter(
      (id) => hiddenCols.indexOf(id) === -1,
    );
    const [removed] = newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, removed);

    table.setColumnOrder(newColumnOrder);
    LocalStorage.set("products_table", {
      ...LocalStorage?.products_table,
      order: newColumnOrder,
    });
  };

  const onPageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    table.setPageSize(newPageSize);
    params = { ...params, limit: String(newPageSize) };
    setSearchParams(params);
    LocalStorage.set("products_table", {
      ...LocalStorage?.products_table,
      page_size: newPageSize,
    });
  };

  const handleDelete = () => {
    const ids = Object.keys(rowSelection);

    const body = {
      ids,
    };

    ids.forEach((id) => {
      queryClient.removeQueries(["products", id]);
    });

    mutate(body);

    setRowSelection({});
  };

  const onPageChange = (page) => {
    table.setPageIndex(page - 1);
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const onProductSearchChange = (search) => {
    params = { ...params, search };
    return debouncedSearch(params);
  };

  const onColResize = (e) => {
    const colId = e.target.parentElement.id;
    const colWidth = e.target.parentElement.style.width;

    if (cols.includes(colId) && colWidth) {
      const curr_col_widths = Array.from(document.querySelectorAll(".col")).map(
        (elm) => {
          let { width } = elm.style;

          if (!width) {
            width = getStyleVal(elm, "width");
          }

          return [elm.id, width];
        },
      );

      LocalStorage.set("products_table", {
        ...LocalStorage?.products_table,
        col_widths: {
          ...LocalStorage?.products_table?.col_widths,
          ...Object.fromEntries(curr_col_widths),
          [e.target.parentElement.id]: e.target.parentElement.style.width,
        },
      });
    }

    // bug here, sometimes it is empty just like in makeresizable.js
    // solution, either lock the pointer with pointer lock api or do the same as in makeresizable.js
    // console.log(
    //   e.target.parentElement.id,
    //   e.target.parentElement.style.width,
    // );
  };

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const effects = useMemo(() => {
    const updateSearchParams = (status) => {
      params = { ...params, active_for_sale: status, page: "1" };
      setSearchParams(params);
    };

    return [() => table.setPageIndex(0), updateSearchParams];
  }, [setSearchParams, table]);

  useEffect(() => {
    const inputValue = searchParams.get("search");
    if (inputValue) {
      searchRef.current.value = inputValue;
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(params);
  }, [setSearchParams]);

  const { headers } = table.getHeaderGroups()[0] || [];

  return (
    <Fade in>
      <ProductsStatus
        options={productsStatusOptions}
        effects={effects}
        count={total}
        initialVal={params.active_for_sale}
      />

      <Flex my={4} justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap="20px">
          <Search
            ref={searchRef}
            inputProps={inputStyles}
            search={{
              onChange: onProductSearchChange,
            }}
            placeholder={t("search_product")}
          />

          <TableFilter
            setSearchParams={setSearchParams}
            searchParams={searchParams}
          />

          {rowSelected && (
            <Can I={DELETE} a={section}>
              <IconButton
                height="45px"
                width="52px"
                aria-label="Delete products"
                icon={<Image src={DeleteIcon} alt="delete" />}
                borderRadius="10px"
                bg="rgba(239, 68, 68, 0.1)"
                colorScheme="gray"
                _hover={{
                  bg: "rgba(239, 68, 68, 0.2)",
                }}
                onClick={handleDelete}
              />
            </Can>
          )}
        </Flex>

        <Flex alignItems="center" gap={2}>
          <IconButton
            height="45px"
            width="48px"
            aria-label="Search database"
            icon={<FilterIcon color="#fff" transform="rotate(90deg)" />}
            borderRadius="10px"
          />

          <Can I={CREATE} a={section}>
            <Button
              height="45px"
              width="100px"
              borderRadius="10px"
              color="#fff"
              onClick={() => {
                navigate(`${pathname}/create-product`);
              }}
            >
              {t("create")}
            </Button>
          </Can>
        </Flex>
      </Flex>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <Flex
              {...provided.droppableProps}
              ref={provided.innerRef}
              id="container"
            >
              {headers.slice(0, headers.length - 1).map((header, index) => (
                <TableColumn
                  key={header.id}
                  header={header}
                  rows={table.getRowModel().rows}
                  colIdx={index}
                  isLast={false}
                />
              ))}
              {provided.placeholder}
              <TableColumn
                key="filter"
                header={headers.at(-1)}
                rows={table.getRowModel().rows}
                colIdx={headers.length - 1}
                isLast
              />
            </Flex>
          )}
        </Droppable>
      </DragDropContext>

      <ColumnResizer onMouseUp={onColResize} />

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
        onDownload={openDrawer}
        leftElement={
          <IconButton
            data-action="download"
            colorScheme="gray"
            size="md"
            onClick={openExcelDownloadModal}
          >
            <DownloadIcon
              fill="colors.headingColor"
              width="18px"
              height="18px"
            />
          </IconButton>
        }
      />
      <DownloadScales isOpen={isDrawerOpen} onClose={closeDrawer} />
      <DownloadProducts
        isOpen={isExcelDownloadModalOpen}
        onClose={closeExcelDownloadModal}
      />
    </Fade>
  );
}

ProductsTable.propTypes = {
  setProductView: PropTypes.func.isRequired,
};
