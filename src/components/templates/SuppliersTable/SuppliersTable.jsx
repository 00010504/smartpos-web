import { useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSuppliersQuery } from "@/queries";
import { useAbilityContext } from "@/contexts/abilityContext";
import { useTranslation } from "react-i18next";
import { Flex, Heading, Button } from "@chakra-ui/react";
import { debounce } from "lodash";
import { deleteSupplier } from "@/services";
import useSection from "@/hooks/useSection";
import useToast from "@/hooks/useToast";
import qs from "qs";
import { UPDATE } from "@/constants/permissions";
import CustomTable from "@/components/organisms/CustomTable";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import Search from "@/components/molecules/Input/Search";

const tableHeaders = [
  ["company_name", "20%"],
  ["aggreement_number", "20%"],
  ["name", "20%"],
  ["phone_number", "25%"],
  ["actions", "15%"],
];

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: "10",
  page: "1",
  ...parsed,
};

function SuppliersTable() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
    search: "",
  });
  const { addToast } = useToast();
  const { t } = useTranslation();
  const ability = useAbilityContext();
  const section = useSection();

  const { data: queryData, isFetching } = useQuery({
    ...getSuppliersQuery(params),
  });

  const { data: suppliers, total } = queryData ?? { data: [], total: 0 };
  const gotoEdit = (supplier_id) => {
    navigate(`/products/suppliers/edit/${supplier_id}`);
  };
  const editAbility = ability.can(UPDATE, section) ? gotoEdit : null;

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const changePage = (page) => {
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    params = { ...params, limit: String(newPageSize) };
    setSearchParams(params);
  };

  const { mutate } = useMutation(deleteSupplier, {
    onSuccess: (id) => {
      queryClient.invalidateQueries(["suppliers"]);
      queryClient.removeQueries(["suppliers", id]);
      addToast({
        title: `${t("supplier")} ${t("deleted_successfully")}`,
        status: "success",
      });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

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
      <Heading fontWeight="600" fontSize="28px" mb={3}>
        {t("suppliers")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard"), isLink: true },
          { name: t("products"), isLink: false },
          { name: t("suppliers"), isLink: false },
        ]}
        containerStyles={{ mb: 0 }}
      />

      <Flex
        mt="15px"
        mb="15px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Search
          ref={searchRef}
          search={{
            onChange: onSearchChange,
          }}
          placeholder={t("name_or_phone")}
        />
        <Button
          mt={3}
          onClick={() => navigate("/products/suppliers/create-supplier")}
          w="100px"
          height="45px"
          color="#fff"
        >
          {t("create")}
        </Button>
      </Flex>
      <CustomTable
        isDataLoading={isFetching}
        th={tableHeaders}
        td={suppliers?.map((supplier) => ({
          id: supplier?.id,
          supplier_company_name: supplier?.supplier_company_name,
          agreement_number: supplier?.agreement_number || "Unfilled",
          name: supplier?.name,
          phone_number: supplier?.phone_number,
        }))}
        onItemDelete={handleDelete}
        onItemEdit={editAbility}
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

export default SuppliersTable;
