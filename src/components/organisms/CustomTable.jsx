import { useRef } from "react";
import {
  Button,
  Flex,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { t } from "i18next";
import useRowId from "@/hooks/useRowId";
import values from "@/helpers/values";
import PropTypes from "prop-types";
import edit from "@/assets/edit.svg";
import deleteicon from "@/assets/delete.svg";
import DeleteModal from "../molecules/DeleteModal";
import TableFooter from "../molecules/TableFooter";
import Empty from "../molecules/Empty";
import DownloadIcon from "../atoms/Icons/Download";

export default function CustomTable({
  isDataLoading,
  th,
  td,
  pagination,
  pageSize,
  onItemDelete,
  onItemEdit,
  onItemView,
  onDownload,
}) {
  const ref = useRef(null);
  const [row, clearRowState] = useRowId(ref);

  return (
    <>
      {td.length > 0 && (
        <>
          <TableContainer>
            <Table>
              <Thead {...theadSx}>
                <Tr>
                  {th.map(([name, width]) => (
                    <Th
                      key={name}
                      {...thSx}
                      w={width}
                      _first={roundedLeft}
                      _last={roundedRight}
                      borderBottom="none"
                    >
                      {t(name)}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody ref={ref}>
                {td.map((entity) => (
                  <Tr key={entity.id} data-row-id={entity.id}>
                    {values(entity, { exclude: "id" }).map(
                      (cellValue, cellIndex) => (
                        <Td
                          // eslint-disable-next-line react/no-array-index-key
                          key={`entity__${entity.id}__${cellIndex}`}
                          {...tdSx}
                          _first={{
                            color: "colors.link !important",
                            fontWeight: 700,
                            // cursor: "pointer",
                            ...roundedLeft,
                          }}
                          _last={roundedRight}
                        >
                          {cellValue}
                        </Td>
                      ),
                    )}
                    <Td {...tdSx} pt="22px" pl={4}>
                      <Flex alignItems="center" gap="5px">
                        {onItemEdit && (
                          <Button
                            data-action="edit"
                            variant="link"
                            onClick={() => onItemEdit(entity.id)}
                          >
                            <Image
                              maxHeight="24px"
                              width="24px"
                              src={edit}
                              alt="edit"
                            />
                          </Button>
                        )}
                        {onItemDelete && (
                          <>
                            <Button data-action="delete" variant="link">
                              <Image
                                maxHeight="24px"
                                width="24px"
                                src={deleteicon}
                                alt="delete"
                                cursor="pointer"
                              />
                            </Button>
                            <DeleteModal
                              isOpen={
                                row.id === entity.id && row.action === "delete"
                              }
                              onClose={clearRowState}
                              onDelete={() => onItemDelete(row.id)}
                              title={t("are_you_sure_want_to_delete")}
                              description={t("you_cant_restore_after_delete")}
                            />
                          </>
                        )}
                        {onItemView && (
                          <IconButton
                            data-action="edit"
                            colorScheme="gray"
                            size="sm"
                            onClick={() => onItemView(entity.id)}
                          >
                            <ViewIcon width="15px" height="15px" />
                          </IconButton>
                        )}
                        {onDownload && (
                          <IconButton
                            data-action="download"
                            colorScheme="gray"
                            size="sm"
                            onClick={() => onDownload(entity.id)}
                          >
                            <DownloadIcon
                              fill="colors.headingColor"
                              width="18px"
                              height="18px"
                            />
                          </IconButton>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <TableFooter
            pagination={{
              total: pagination.total || 1,
              current: pagination.current,
              onChange: pagination.onChange,
            }}
            pageSize={{
              value: pageSize.value,
              onChange: pageSize.onChange,
            }}
            isDownloadable={false}
          />
        </>
      )}
      {td.length === 0 && !isDataLoading && (
        <Empty title={t("nothing_has_yet_been_created")} />
      )}
    </>
  );
}

CustomTable.defaultProps = {
  th: [],
  td: [],
  onItemDelete: null,
  onItemEdit: null,
  onItemView: null,
  onDownload: null,
  isDataLoading: false,
};

CustomTable.propTypes = {
  th: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  td: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  onItemDelete: PropTypes.func,
  onItemEdit: PropTypes.func,
  onItemView: PropTypes.func,
  pagination: PropTypes.shape({
    total: PropTypes.number,
    current: PropTypes.number,
    onChange: PropTypes.func,
  }).isRequired,
  pageSize: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.number,
  }).isRequired,
  isDataLoading: PropTypes.bool,
  onDownload: PropTypes.func,
};

const thSx = {
  textTransform: "none",
  fontSize: "md",
  color: "#BEBEBE",
  height: "56px",
};

const theadSx = {
  rounded: "2xl",
};

const tdSx = {
  borderBottom: "none",
  py: "17px",
};

const roundedLeft = {
  borderTopLeftRadius: "10px",
  borderBottomLeftRadius: "10px",
};

const roundedRight = {
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
};
