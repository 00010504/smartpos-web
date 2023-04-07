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
import LocalStorage from "@/utils/LocalStorage";
import { deleteCashbox } from "@/services";
import { getCashboxesQuery } from "@/queries"; /* eslint-disable react-hooks/exhaustive-deps */

const tableHeaders = [
  ["cashbox", "40%"],
  ["store", "40%"],
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

export default function CashboxTemplate() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const { data: queryData, isFetched } = useQuery({
    ...getCashboxesQuery(params),
  });

  const { data: cashboxes, total } = queryData ?? { data: [], total: 0 };

  const { mutate } = useMutation(deleteCashbox, {
    onSuccess: (id) => {
      queryClient.invalidateQueries(["cashboxes"]);
      queryClient.removeQueries(["cashboxes", id]);
      addToast({
        title: `${t("cashbox")} ${t("deleted_successfully")}`,
        status: "success",
      });
    },
    onError: (error) => {
      addToast({ title: error.data.message });
    },
  });

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
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

  const onSearchChange = (e) => {
    return debouncedSearch(() => {
      params = { ...params, search: e };
      setSearchParams(params);
    });
  };

  const handleDelete = async (id) => {
    return new Promise((resolve) => {
      mutate(id, { onSuccess: resolve });
    });
  };

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  });

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("cashbox")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("settings") },
          { name: t("cashbox") },
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
          search={{
            onChange: onSearchChange,
          }}
          placeholder={t("category_name")}
        />
        <Button
          mt={3}
          onClick={() => navigate("/settings/cashbox/create-cashbox")}
          w="100px"
          height="45px"
          color="#fff"
        >
          {t("create")}
        </Button>
      </Flex>
      {isFetched && (
        <CustomTable
          th={tableHeaders}
          td={cashboxes?.map((cashbox) => ({
            id: cashbox?.id,
            title: cashbox?.name,
            shop: cashbox?.shop?.name,
          }))}
          onItemDelete={handleDelete}
          onItemEdit={(cashbox_id) =>
            navigate(`/settings/cashbox/single-cashbox/${cashbox_id}`)
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
