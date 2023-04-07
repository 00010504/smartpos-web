import { useMemo, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployeesQuery } from "@/queries";
import { useTranslation } from "react-i18next";
import { Fade, Button, Flex, Box, Badge, Text } from "@chakra-ui/react";
import { debounce } from "lodash";
import qs from "qs";
import useToast from "@/hooks/useToast";
import { deleteEmployee } from "@/services";
import CustomTable from "@/components/organisms/CustomTable";
import Search from "@/components/molecules/Input/Search";
import {
  tableHeaders,
  inputStyles,
} from "./data"; /* eslint-disable no-nested-ternary */

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: "10",
  page: "1",
  ...parsed,
};

export default function EmployeesListTable() {
  const searchRef = useRef(null);
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });

  const { data: employees, isFetched } = useQuery({
    ...getEmployeesQuery(params),
  });

  const { mutate } = useMutation(deleteEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries(["employees", params]);
      addToast({
        title: `${t("employee")} ${t("deleted_successfully")}`,
        status: "success",
      });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
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
    <Fade in>
      <Flex
        marginTop="-25px"
        marginBottom={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap="20px">
          <Search
            inputProps={inputStyles}
            placeholder={t("name_or_phone")}
            ref={searchRef}
            search={{
              onChange: onSearchChange,
            }}
          />
        </Box>
        <Link to="/management/employees/create-employee">
          <Button height="45px" width="100px" borderRadius="10px" color="#fff">
            {t("create")}
          </Button>
        </Link>
      </Flex>

      {isFetched && (
        <CustomTable
          th={tableHeaders}
          td={employees?.employees?.map((employee) => ({
            id: employee?.user.id,
            name: `${employee.user.first_name} ${employee.user.last_name}`,
            phone_number: (
              <Text fontWeight={600}>{`+${employee.user.phone_number}`}</Text>
            ),
            owner: <Text fontWeight={600}>{employee.role.name}</Text>,
            status: (
              <Badge
                borderRadius={5}
                padding="2px 6px"
                colorScheme={
                  employee.status?.name === "active" ||
                  employee.status?.name === "new"
                    ? "green"
                    : employee.status?.name === "invited"
                    ? "blue"
                    : "red"
                }
              >
                {t(employee.status?.name)}
              </Badge>
            ),
          }))}
          onItemDelete={handleDelete}
          pagination={{
            total: employees?.total || 1,
            current: +searchParams.get("page"),
            onChange: changePage,
          }}
          pageSize={{
            value: +searchParams.get("limit"),
            onChange: changeLimit,
          }}
          onItemEdit={(employee_id) =>
            navigate(`/management/employees/edit/${employee_id}`)
          }
        />
      )}
    </Fade>
  );
}
