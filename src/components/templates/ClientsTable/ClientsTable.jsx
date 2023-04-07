import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientsQuery } from "@/queries";
import { deleteClient } from "@/services";
import qs from "qs";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { Flex, Button } from "@chakra-ui/react";
import useToast from "@/hooks/useToast";
import CustomTable from "@/components/organisms/CustomTable";
import Search from "@/components/molecules/Input/Search";
import Filter from "@/components/molecules/Filter/Filter";
import { tableHeaders, initials } from "./data";

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: "10",
  page: "1",
  ...parsed,
};

export default function ClientsTable() {
  const searchRef = useRef(null);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams(
    initials.searchParams,
  );

  const { data: queryData } = useQuery({
    ...getClientsQuery(params),
  });

  const { data: clients, total } = queryData ?? { data: [], total: 0 };

  const changePage = (page) => {
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    params = { ...params, limit: newPageSize };
    setSearchParams(params);
  };

  const { mutate } = useMutation(deleteClient, {
    onSuccess: (id) => {
      queryClient.invalidateQueries(["clients"]);
      queryClient.removeQueries(["clients", id]);
      addToast({
        title: `${t("client")} ${t("deleted_successfully")}`,
        status: "success",
      });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const handleDelete = async (id) => {
    return new Promise((resolve) => {
      mutate(id, { onSuccess: resolve });
    });
  };

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const onSearchChange = (e) => {
    return debouncedSearch(() => {
      params = { ...params, search: e };
      setSearchParams(params);
    });
  };

  const onFilter = () => {};

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, [searchParams]);

  return (
    <>
      <Flex
        mt="15px"
        mb="15px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap={8}>
          <Search
            ref={searchRef}
            search={{
              onChange: onSearchChange,
            }}
            placeholder={t("name_or_phone")}
          />
          <Filter onQueryComplete={onFilter} />
        </Flex>

        <Button
          mt={3}
          onClick={() => navigate("/clients/list/create-client")}
          w="100px"
          height="45px"
          color="#fff"
        >
          {t("create")}
        </Button>
      </Flex>
      <CustomTable
        th={tableHeaders}
        td={clients?.map((client) => ({
          id: client?.id,
          full_name: `${client?.first_name} ${client?.last_name}`,
          external_id: client?.external_id,
          phone_number: `+${client?.phone_number}`,
          group: client?.group?.name || "",
          discount: client?.discount,
          total_purchase_amounts: client?.total_purchase_amount,
          balance: client?.balance,
        }))}
        onItemDelete={handleDelete}
        onItemEdit={(client_id) => {
          navigate(`/clients/list/edit-client/${client_id}`);
        }}
        pagination={{
          total,
          current: +searchParams.get("page"),
          onChange: changePage,
        }}
        pageSize={{
          value: +searchParams.get("limit"),
          onChange: changeLimit,
        }}
      />
    </>
  );
}
