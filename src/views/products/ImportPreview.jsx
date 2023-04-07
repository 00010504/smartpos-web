import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { acceptImport, getImportItems } from "@/services";
import { Box, Button, Flex, SimpleGrid } from "@chakra-ui/react";
import qs from "qs";
import GoBack from "@/components/molecules/GoBack";
import ImportPreviewTable from "@/components/organisms/ImportPreviewTable/ImportPreviewTable";
import ImportPreviewStatistics from "@/components/organisms/ImportPreviewStatistics/ImportPreviewStatistics";
import Search from "@/components/molecules/Input/Search";

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: "10",
  page: "1",
  ...parsed,
};

function ImportPreview() {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const { file_uid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const changePage = (page) => {
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    params = { ...params, limit: newPageSize };
    setSearchParams(params);
  };

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const onItemSearchChange = (search) => {
    params = { ...params, search };
    return debouncedSearch(params);
  };

  useEffect(() => {
    const inputValue = searchParams.get("search");
    if (inputValue) {
      searchRef.current.value = inputValue;
    }
  }, [searchParams]);

  useEffect(() => {
    getImportItems(file_uid, params).then((res) => {
      setItems(res);
    });
  }, [file_uid, params]);

  const onSubmit = async () => {
    setLoading(true);

    try {
      await acceptImport(file_uid);
      await queryClient.invalidateQueries(["imports"]);
      navigate("/products/import", { replace: true });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding="32px 80px">
      <GoBack title={t("import_preview")} backUrl="/products/import" />
      <SimpleGrid
        gridTemplateColumns="350px auto"
        mt={5}
        gap="45px"
        alignItems="start"
      >
        <ImportPreviewStatistics
          statistics={{
            products: items?.products || 0,
            trade_units: items?.trade_units || 0,
            sale_price: items?.sale_price || 0,
            supply_price: items?.supply_price || 0,
          }}
        />
        <Box>
          <Flex justifyContent="space-between" mb={10} alignItems="center">
            <Search
              ref={searchRef}
              search={{
                onChange: onItemSearchChange,
              }}
              placeholder={t("search")}
              inputProps={{
                placeholder: t("article_barcode_name"),
                height: "50px",
                border: "none",
                bg: "colors.grayF9",
                borderRadius: "10px",
                margin: "0 !important",
              }}
            />

            <Button
              height="50px"
              colorScheme="gray"
              bg="colors.grayF9"
              color="colors.icon"
            >
              {t("printing_price_tag")}
            </Button>
            {!window.location.pathname.includes("view-only") && (
              <Flex gap="24px">
                <Button
                  height="48px"
                  width="100px"
                  onClick={onSubmit}
                  isLoading={loading}
                  color="#fff"
                >
                  {t("accept")}
                </Button>
              </Flex>
            )}
          </Flex>
          <ImportPreviewTable
            searchParams={searchParams}
            changeLimit={changeLimit}
            changePage={changePage}
            items={items}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default ImportPreview;
