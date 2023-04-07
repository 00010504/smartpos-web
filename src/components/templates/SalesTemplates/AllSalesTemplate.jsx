import { useRef, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllOrdersQuery } from "@/queries";
import { useTranslation } from "react-i18next";
import { Button, Collapse, Flex, Image } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { debounce } from "lodash";
import Search from "@/components/molecules/Input/Search";
import Empty from "@/components/molecules/Empty";
import TableFooter from "@/components/molecules/TableFooter";
import PrintIcon from "@/assets/print.svg";
import AllSalesTable from "./AllSalesTable";
import AllSalesFilter from "./AllSalesFilter";
import SaleView from "./SaleView";
import SalesStatistics from "./SalesStatistics";

const initialParams = {
  search: "",
  limit: "10",
  page: "1",
  client_ids: "",
  shop_ids: "",
  cashier_ids: "",
  min_amount: "",
  max_amount: "",
};

export default function AllSalesTemplate() {
  const [saleId, setSaleId] = useState("");
  const [showStatistics, setShowStatistics] = useState(false);
  const [params, setParams] = useState(initialParams);
  const searchRef = useRef(null);

  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: sales } = useQuery({
    ...getAllOrdersQuery(params),
    keepPreviousData: true,
  });

  const debouncedSearch = useMemo(() => {
    return debounce(setParams, 500);
  }, [setParams]);

  const onSearchChange = (search) => {
    return debouncedSearch({ ...params, search });
  };

  const changePage = (page) => {
    setParams({ ...params, page: String(page) });
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    setParams({ ...params, limit: newPageSize });
  };

  const salesExist = sales?.data.length > 0;

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(params);
  }, [params, setSearchParams]);

  return (
    <>
      <SaleView saleId={saleId} setSaleId={setSaleId} />
      <Flex
        mt="-24px"
        mb="18px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex gap="20px">
          <Search
            search={{
              onChange: onSearchChange,
            }}
            ref={searchRef}
            placeholder={t("name_or_phone")}
          />
          <AllSalesFilter params={params} setParams={setParams} />
        </Flex>
        <Flex gap="24px" mt="13px">
          <Button
            colorScheme="gray"
            bg="colors.grayF9"
            height="53px"
            px={5}
            mt="-2px"
            rightIcon={showStatistics ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setShowStatistics(!showStatistics)}
          >
            {t("statistics")}
          </Button>
          <Button
            rightIcon={<Image src={PrintIcon} alt="" />}
            height="50px"
            px={5}
            bg="brand.500"
            color="white"
          >
            {t("print_report")}
          </Button>
        </Flex>
      </Flex>

      <Collapse in={showStatistics} animateOpacity>
        <SalesStatistics
          statistics={sales?.statistics}
          showStatistics={showStatistics}
        />
      </Collapse>

      {salesExist ? (
        <AllSalesTable setSaleId={setSaleId} sales={sales?.data} />
      ) : (
        <Empty title={t("sales_not_found")} />
      )}

      <TableFooter
        pagination={{
          total: sales?.total || 1,
          current: +searchParams.get("page"),
          onChange: changePage,
        }}
        pageSize={{
          value: +searchParams.get("limit"),
          onChange: changeLimit,
        }}
        isDownloadable={false}
      />
    </>
  );
}
