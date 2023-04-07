/* eslint-disable react/no-array-index-key */
import { useRef } from "react";
import {
  HStack,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
} from "@chakra-ui/react";
import useRowId from "@/hooks/useRowId";
import { t } from "i18next";
import PropTypes from "prop-types";
import deleteicon from "@/assets/delete.svg";
import DeleteModal from "../molecules/DeleteModal";
import UnitCreate from "./ProductSettingOrganism/UnitCreate";

export default function UnitTable({ th, td, onItemDelete, recall }) {
  const ref = useRef(null);
  const [row, clearRowState] = useRowId(ref);

  return (
    <Table mt="30px">
      <Thead {...styles.head}>
        <Tr>
          {th.map((name) => (
            <Th key={name} {...styles.th}>
              {t(name)}
            </Th>
          ))}
          <Th {...styles.th}>{t("actions")}</Th>
        </Tr>
      </Thead>
      <Tbody ref={ref}>
        {td.map((obj) => (
          <Tr data-row-id={obj.id} key={obj.id}>
            {Object.values(obj).map((value, index) => {
              return value === obj.id ? null : (
                <Td key={index} {...styles.td}>
                  {typeof value === "string" ? value : value.value}
                </Td>
              );
            })}
            <Td {...styles.td}>
              <HStack>
                <UnitCreate id={row.id} type="edit" recall={recall} />
                <Button data-action="delete" variant="link">
                  <Image src={deleteicon} alt="edit" cursor="pointer" />
                </Button>
                <DeleteModal
                  isOpen={row.id === obj.id && row.action === "delete"}
                  onClose={clearRowState}
                  onDelete={() => onItemDelete(row.id)}
                  title={t("are_you_sure_want_to_delete")}
                  description={t("you_cant_restore_after_delete")}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

UnitTable.propTypes = {
  th: PropTypes.arrayOf(PropTypes.string).isRequired,
  td: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onItemDelete: PropTypes.func.isRequired,
  recall: PropTypes.PropTypes.func.isRequired,
};

const styles = {
  th: {
    textTransform: "none",
    fontWeight: "600",
    padding: "20px 20px",
    color: "#BEBEBE",
    fontSize: "16px",
    border: "none !important",
  },
  head: {
    border: "none !important",
  },
  td: {
    borderBottom: "none",
    fontWeight: "bold",
    fontSize: "sm",
  },
};
