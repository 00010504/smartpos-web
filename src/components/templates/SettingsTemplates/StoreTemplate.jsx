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
import useToast from "@/hooks/useToast";
import { deleteShop } from "@/services";
import { getStoresQuery } from "@/queries";
import LocalStorage from "@/utils/LocalStorage"; /* eslint-disable react-hooks/exhaustive-deps */

const tableHeaders = [
  ["store", "40%"],
  ["number_of_cashboxes", "40%"],
  ["actions", "20%"],
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

export default function StoreTemplate() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const { data: queryData, isFetched } = useQuery({
    ...getStoresQuery(params),
  });

  const { mutate } = useMutation(deleteShop, {
    onSuccess: (id) => {
      queryClient.invalidateQueries(["stores"]);
      queryClient.removeQueries(["stores", id]);
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const { data: stores, total } = queryData ?? { data: [], total: 0 };

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, []);

  const onSearchChange = (e) => {
    return debouncedSearch(() => {
      params = { ...params, search: e };
      setSearchParams(params);
    });
  };

  const changePage = (page) => {
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    params = { ...params, limit: newPageSize };
    setSearchParams(params);
  };

  const deleteStore = async (id) => {
    return new Promise((resolve) => {
      mutate(id, { onSuccess: resolve });
      addToast({
        title: `${t("store")} ${t("deleted_successfully")}`,
        status: "success",
      });
    });
  };

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, []);

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("store")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard"), isLink: true },
          { name: t("settings"), isLink: false },
          { name: t("store"), isLink: false },
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
          placeholder={t("store_name")}
          search={{
            onChange: onSearchChange,
          }}
        />
        <Button
          mt={3}
          w="100px"
          height="45px"
          color="#fff"
          onClick={() => navigate("/settings/store/create-store")}
        >
          {t("create")}
        </Button>
      </Flex>

      {isFetched && (
        <CustomTable
          th={tableHeaders}
          td={stores?.map((shop) => ({
            id: shop?.id,
            name: shop?.title,
            number_of_cashboxes: shop?.number_of_cashbox ?? 0,
          }))}
          onItemDelete={deleteStore}
          onItemEdit={(store_id) =>
            navigate(`/settings/store/single-store/${store_id}`)
          }
          pagination={{
            total: +total || 1,
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
