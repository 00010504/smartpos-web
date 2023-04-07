import { useEffect, useRef, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { getSupplierOrderItems, updateSupplierOrderCount } from "@/services";
import Search from "@/components/molecules/Input/Search";
import { css } from "./data";

const productsHeadings = [
  "order_number",
  "name",
  "barcode",
  "ordered",
  "received",
  "counted",
];

function ReceiveSupplierOrder() {
  const [products, setProducts] = useState([]);
  const { supplier_order_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
  });
  const { t } = useTranslation();
  const searchRef = useRef(null);

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const onSearchChange = (val) => {
    return debouncedSearch((prev) => {
      prev.set("search", val);
      return prev;
    });
  };

  const debouncedOnChange = useMemo(() => {
    return debounce(
      (id, field_name, value) =>
        updateSupplierOrderCount(id, {
          [field_name]: +value,
        }),
      300,
    );
  }, []);

  useEffect(() => {
    getSupplierOrderItems(supplier_order_id).then((data) => {
      setProducts(data);
    });
  }, [supplier_order_id]);

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, [searchParams]);

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontWeight="600" fontSize="28px" mb={3}>
          {t("purchase_count")}
        </Heading>
        <Button minW="100px" height="45px" color="#fff">
          {t("receive")}
        </Button>
      </Flex>
      <Box my={8}>
        <FormLabel>Product name</FormLabel>
        <Search
          ref={searchRef}
          search={{
            onChange: onSearchChange,
          }}
          inputProps={{
            margin: "0",
            width: "100%",
            marginTop: "5px",
          }}
          placeholder={t("scan_and_search_products")}
        />
      </Box>
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
            {products?.data?.map((product, i) => (
              <Tr key={product.id} {...css.tr}>
                {console.log(products?.data)}
                <Td {...css.td}>{i + 1}</Td>
                <Td {...css.td}>{product.name}</Td>
                <Td {...css.td}>{product.quantity}</Td>
                <Td {...css.td}>{product.expected_amount}</Td>
                <Td {...css.td}>{product.arrived_amount}</Td>
                <Td {...css.td}>
                  <Input
                    {...css.input}
                    type="number"
                    defaultValue={product.arrived_amount}
                    onChange={(e) =>
                      debouncedOnChange(
                        product.id,
                        "arrived_amount",
                        e.target.value,
                      )
                    }
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}

export default ReceiveSupplierOrder;
