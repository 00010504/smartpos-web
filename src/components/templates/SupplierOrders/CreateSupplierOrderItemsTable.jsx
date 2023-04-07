import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Input,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import priceFormatter from "@/helpers/priceFormatter";
import DeleteIcon from "@/assets/icons/delete.svg";
import { css, productsHeadings } from "./data";

function Row({ item, updateItem, index, order, removeItem, loading }) {
  const [discount, setDiscount] = useState(item.discount || 0);
  const { t } = useTranslation();
  const debouncedOnChange = useMemo(() => {
    return debounce(
      (product, field_name, value) => updateItem(product, field_name, value),
      300,
    );
  }, [updateItem]);

  return (
    <Tr>
      <Td {...css.td}>{index + 1}</Td>
      <Td {...css.td}>
        <Text width="180px" lineHeight={1.5}>
          {item.product_name}
        </Text>
      </Td>
      <Td minW="150px" {...css.td}>
        {item.barcode[item.barcode.length - 1] || "Not filled"}
      </Td>
      <Td {...css.td}>
        {order?.status?.name !== "Recieved" ? (
          <Input
            {...css.input}
            type="number"
            name={`items[${index}].expected_amount`}
            defaultValue={item.expected_amount}
            onChange={(e) =>
              debouncedOnChange(item, "expected_amount", e.target.value)
            }
            width="80px"
          />
        ) : (
          item.expected_amount
        )}
      </Td>
      <Td {...css.td} minW="160px" position="relative">
        {order?.status?.name !== "Recieved" ? (
          <>
            <Input
              {...css.input}
              type="number"
              name={`items[${index}].supply_price`}
              defaultValue={item.cost}
              onChange={(e) => debouncedOnChange(item, "cost", e.target.value)}
            />
            <Flex
              bottom="4px"
              position="absolute"
              gap="5px"
              alignItems="center"
              fontSize="12px"
              right={6}
            >
              {pcDiff(item.last_cost, item.cost)}
            </Flex>
          </>
        ) : (
          item.cost
        )}
      </Td>
      <Td {...css.td} minW="112px">
        {order?.status?.name !== "Recieved" ? (
          <Input
            {...css.input}
            type="number"
            name={`items[${index}].discount`}
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "+" || e.key === "-") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              if (+e.target.value > 100 || +e.target.value < 0) {
                return;
              }
              setDiscount(e.target.value);
              debouncedOnChange(item, "discount", e.target.value);
            }}
            value={discount}
          />
        ) : (
          item.discount
        )}
      </Td>
      <Td {...css.td} minW="200px">
        <Text fontWeight={600}>
          {loading[item.id] ? (
            t("calculating")
          ) : (
            <>
              {item.sold_amount}{" "}
              <Text fontWeight={400} pl="8px" as="span" textAlign="right">
                UZS
              </Text>
            </>
          )}
        </Text>
      </Td>
      <Td>
        {order?.status?.name !== "Recieved" && (
          <Button variant="link" onClick={() => removeItem(item)}>
            <Image
              maxHeight="24px"
              width="24px"
              src={DeleteIcon}
              alt="edit"
              cursor="pointer"
            />
          </Button>
        )}
      </Td>
    </Tr>
  );
}

function CreateSupplierOrderItemsTable({
  order,
  updateItem,
  removeItem,
  loading,
}) {
  const { t } = useTranslation();

  return (
    <Box overflow="auto">
      <Table mt={1}>
        <Thead>
          <Tr>
            {productsHeadings.map((heading) => (
              <Th key={heading} {...css.th}>
                {t(heading)}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {order?.items?.map((item, index) => (
            <Row
              order={order}
              updateItem={updateItem}
              index={index}
              removeItem={removeItem}
              item={item}
              key={item.product_id}
              loading={loading}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default CreateSupplierOrderItemsTable;

CreateSupplierOrderItemsTable.defaultProps = {
  order: {
    items: [],
  },
};

CreateSupplierOrderItemsTable.propTypes = {
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  order: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        product_id: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
        barcode: PropTypes.arrayOf(PropTypes.string).isRequired,
        expected_amount: PropTypes.number.isRequired,
        cost: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        sold_amount: PropTypes.number.isRequired,
      }),
    ),
  }),
  loading: PropTypes.bool.isRequired,
};

Row.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    barcode: PropTypes.arrayOf(PropTypes.string).isRequired,
    expected_amount: PropTypes.number.isRequired,
    cost: PropTypes.number.isRequired,
    last_cost: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    sold_amount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,

  index: PropTypes.number.isRequired,
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  order: PropTypes.shape({
    status: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

function pcDiff(from, to) {
  if (from === to) {
    return ["0%"];
  }

  if (from === 0) {
    return ["100%", <TriangleUpIcon color="#00FF00" />];
  }

  const result = (to / (from / 100) / from - 1) * 100;

  if (result > 0) {
    return [`${priceFormatter(result)}%`, <TriangleUpIcon color="#00FF00" />];
  }

  if (result < 0) {
    return [`${priceFormatter(result)}%`, <TriangleDownIcon color="#FF0000" />];
  }

  return result;
}
