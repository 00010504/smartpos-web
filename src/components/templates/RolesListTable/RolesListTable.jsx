import { useState } from "react";
import { Link } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getModulesQuery, getRolesQuery } from "@/queries";
import settings from "@/config/settings";
import {
  Fade,
  Button,
  Flex,
  Box,
  Table,
  Tr,
  Thead,
  Tbody,
  Th,
} from "@chakra-ui/react";
import Search from "@/components/molecules/Input/Search";
import RolesListRow from "./RolesListRow";
import { tableHeaders, tableStyles } from "./data";

export default function EmployeesListTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState("");

  useIdleTimer({
    timeout: settings.idleTimeout,
    onIdle: () => {
      queryClient.prefetchQuery(getModulesQuery());
    },
    stopOnIdle: true,
  });

  const { data } = useQuery({
    ...getRolesQuery(),
  });

  const roles = data?.data;

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
            placeholder={t("search")}
            search={{
              onChange: setSearch,
            }}
          />
        </Box>
        <Link to="/management/roles/create-role">
          <Button height="45px" width="100px" borderRadius="10px" color="#fff">
            {t("create")}
          </Button>
        </Link>
      </Flex>
      <Table marginTop="25px">
        <Thead {...tableStyles.thead}>
          <Tr>
            {Object.values(tableHeaders).map((header) => (
              <Th
                key={header}
                {...tableStyles.th}
                width={header === "Role Name" ? "50%" : "auto"}
              >
                {t(header)}
              </Th>
            ))}
            <Th {...tableStyles.th}>{t("actions")}</Th>
          </Tr>
        </Thead>

        <Tbody>
          {roles?.map((role) => (
            <RolesListRow key={role.id} role={role} />
          ))}
        </Tbody>
      </Table>
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
