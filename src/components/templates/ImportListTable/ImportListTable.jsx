import { useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { debounce } from "lodash";
import { Fade, Flex, Box, Tag } from "@chakra-ui/react";
import qs from "qs";
import Search from "@/components/molecules/Input/Search";
import DeleteModal from "@/components/molecules/DeleteModal";
import { getImportQuery } from "@/queries";
import useRowId from "@/hooks/useRowId";
import CustomTable from "@/components/organisms/CustomTable";
import { useLangContext } from "@/contexts/langContext";
import { downloadExcelById } from "@/services";
import { th } from "./data";
import Import from "./import";

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: "10",
  page: "1",
  ...parsed,
};

export default function ImportListTable() {
  const searchRef = useRef(null);
  const ref = useRef(null);
  const [row, clearRowState] = useRowId(ref);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useLangContext();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const { data, isFetched } = useQuery({
    ...getImportQuery(params),
  });

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePage = (page) => {
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    params = { ...params, limit: newPageSize };
    setSearchParams(params);
  };

  const onSearchChange = (search) => {
    params = { ...params, search };
    return debouncedSearch(params);
  };

  const onDownload = (id) => {
    downloadExcelById(id).then((res) => {
      const link = document.createElement("a");
      link.href = res.id;
      link.setAttribute("download", "example.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  });

  return (
    <Fade in>
      <Flex
        marginTop="-25px"
        marginBottom={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap="20px">
          <Search
            ref={searchRef}
            inputProps={inputStyles}
            placeholder={t("name_or_phone")}
            search={{
              onChange: onSearchChange,
            }}
          />
        </Box>
        <Import />
      </Flex>
      {isFetched && (
        <CustomTable
          th={th}
          td={data?.imports?.map((importData) => ({
            id: importData.id,
            external_id: importData.external_id,
            import_name: importData.name,
            store: importData.shop.name,
            quantity: importData.quantity,
            total: importData.total_price || 0,
            status: (
              <Tag
                fontSize="12px"
                pt="3px"
                colorScheme={
                  importData.status.name === "NEW" ||
                  importData.status.name === "FINISHED"
                    ? "green"
                    : "red"
                }
                pb="3px"
              >
                {importData.status.translation[lang]}
              </Tag>
            ),
            date:
              importData.created_at &&
              format(parseISO(importData.created_at), "dd.MM.yyyy | HH:mm:ss"),
            created_by: `${importData.created_by.first_name} ${importData.created_by.last_name}`,
          }))}
          pagination={{
            total: data?.count || 1,
            current: +searchParams.get("page"),
            onChange: changePage,
          }}
          pageSize={{
            value: +searchParams.get("limit"),
            onChange: changeLimit,
          }}
          onItemView={(id) =>
            navigate(`/products/import/preview/${id}/view-only`)
          }
          onDownload={onDownload}
        />
      )}
      <DeleteModal
        isOpen={row.action === "delete" && row.id !== null}
        onDelete={() => console.log("Deleted")}
        onClose={clearRowState}
        title="Delete the import?"
        description="Are you sure you want this import"
      />
    </Fade>
  );
}

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
