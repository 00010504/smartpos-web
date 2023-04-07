import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import qs from "qs";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import Search from "@/components/molecules/Input/Search";
import CustomTable from "@/components/organisms/CustomTable";
import LocalStorage from "@/utils/LocalStorage";
import useToast from "@/hooks/useToast";
import { deleteReceipt } from "@/services";
import { getReceiptsQuery } from "@/queries"; /* eslint-disable react-hooks/exhaustive-deps */

const tableHeaders = [
  ["receipt", "auto"],
  ["actions", "150px"],
];

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: String(LocalStorage?.products_table?.page_size) || "10",
  page: "1",
  ...parsed,
};

export default function ReceiptTemplate() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const { data: queryData, isFetched } = useQuery({
    ...getReceiptsQuery(params),
  });

  const { data: receipts, total } = queryData ?? { data: [], total: 0 };

  const { mutate } = useMutation(deleteReceipt, {
    onSuccess: (id) => {
      queryClient.invalidateQueries(["receipts"]);
      queryClient.removeQueries(["receipts", id]);
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
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

  const onSearchChange = (e) => {
    return debouncedSearch(() => {
      params = { ...params, search: e };
      setSearchParams(params);
    });
  };

  const handleDelete = async (id) => {
    return new Promise((resolve) => {
      mutate(id, { onSuccess: resolve });
      addToast({
        title: `${t("receipt")} ${t("deleted_successfully")}`,
        status: "success",
      });
    });
  };

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, []);

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, []);

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("receipt")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard"), isLink: true },
          { name: t("settings"), isLink: false },
          { name: t("receipt"), isLink: false },
        ]}
        containerStyles={{ mb: 0 }}
      />
      <Flex
        mt="15px"
        mb="10px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Search
          ref={searchRef}
          placeholder={t("receipt_name")}
          search={{
            onChange: onSearchChange,
          }}
        />
        <Button
          mt={3}
          width="100px"
          height="45px"
          color="#fff"
          onClick={() => {
            navigate("/settings/receipt/create");
          }}
        >
          {t("create")}
        </Button>
      </Flex>
      {isFetched && (
        <CustomTable
          th={tableHeaders}
          td={receipts?.map((receipt) => ({
            id: receipt?.id,
            name: receipt?.name,
          }))}
          onItemDelete={handleDelete}
          onItemEdit={(receipt_id) =>
            navigate(`/settings/receipt/single-receipt/${receipt_id}`)
          }
          pagination={{
            total: total || 1,
            current: +searchParams.get("page"),
            onChange: changePage,
          }}
          pageSize={{
            value: +searchParams.get("limit"),
            onChange: changeLimit,
          }}
        />
      )}
    </>
  );
}
