import { useRef, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Thead,
  Tr,
  Th,
  Heading,
  Flex,
  Text,
  Image,
  Tbody,
  Td,
  Button,
} from "@chakra-ui/react";
import Search from "@/components/molecules/Input/Search";
import Input from "@/components/molecules/Input/Input";
import DeleteIcon from "@/assets/icons/delete.svg";
import ImagePlaceholderIcon from "@/components/atoms/Icons/ImagePlaceholder";
import { getSaleProducts } from "@/services";
import { useTranslation } from "react-i18next";

function OrderProducts({ setValue, getValues, control, errors, watch }) {
  const searchRef = useRef(null);
  const { t } = useTranslation();
  const [products, setProducts] = useState({
    data: [],
    total: 1,
  });
  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
  });

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, [setSearchParams]);

  const onSearchChange = (val) => {
    return debouncedSearch((prev) => {
      prev.set("search", val);
      return prev;
    });
  };

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, [searchParams]);

  const onClose = () => {
    setSearchParams((prev) => prev.delete("search"));
    if (searchRef.current) searchRef.current.value = "";
  };

  useEffect(() => {
    if (searchParams.get("search")) {
      getSaleProducts({ search: searchParams.get("search") }).then((res) => {
        setProducts(res);
      });
    }
  }, [searchParams]);

  return (
    <Box mt={8}>
      <FormLabel>Product name</FormLabel>
      <Popover
        matchWidth
        isOpen={
          searchRef && searchRef.current && searchRef.current.value.length > 0
        }
        onClose={onClose}
      >
        <PopoverTrigger>
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
        </PopoverTrigger>
        <PopoverContent bg="colors.body" width="100%">
          <PopoverBody>
            {products?.data?.map(
              (product) =>
                !getValues("items")?.find(
                  (item) => item.product_id === product.id,
                ) && (
                  <Flex
                    p={2}
                    key={product.id}
                    justifyContent="space-between"
                    borderRadius="8px"
                    _hover={{
                      bg: "colors.grayF9",
                    }}
                    onClick={() => {
                      onClose();
                      setValue("items", [
                        ...getValues("items"),
                        {
                          product_name: product.name,
                          barcode: product.barcodes[0],
                          cost: Object.values(product?.shop_prices || {})[0]
                            ?.supply_price,
                          discount: 0,
                          expected_amount: 1,
                          product_id: product.id,
                        },
                      ]);
                    }}
                  >
                    <Flex gap="12px">
                      {product?.image ? (
                        <Image
                          width="50px"
                          src={product?.image}
                          alt={product.name}
                        />
                      ) : (
                        <ImagePlaceholderIcon
                          height="36px"
                          color="colors.greyD9"
                          mt={2}
                          width="50px"
                        />
                      )}

                      <Box mt={1}>
                        <Heading size="md">{product.name}</Heading>
                        <Text>
                          {product.sku} / {product?.barcodes[0]}
                        </Text>
                      </Box>
                    </Flex>
                    <Box mt={1}>
                      <Text fontWeight={600}>
                        {
                          Object.values(product?.shop_prices || {})[0]
                            ?.supply_price
                        }{" "}
                        {" / "}
                        {
                          Object.values(product?.shop_prices || {})[0]
                            ?.retail_price
                        }
                      </Text>
                      <Text textAlign="right">UZS</Text>
                    </Box>
                  </Flex>
                ),
            )}
            {products?.data?.length < 1 && (
              <Box p={3} fontWeight={600}>
                <Text textAlign="center">Not products for adding</Text>
              </Box>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Box overflow="auto">
        <Table mt={8}>
          <Thead>
            <Tr>
              <Th {...css.th}>№</Th>
              <Th {...css.th}>Name</Th>
              <Th {...css.th}>Barcode</Th>
              <Th {...css.th}>Quatity</Th>
              <Th {...css.th}>Price</Th>
              <Th {...css.th}>Discount</Th>
              <Th {...css.th}>Total</Th>
              <Th {...css.th}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {watch("items")?.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Tr key={index}>
                <Td {...css.th}>{index + 1}</Td>
                <Td {...css.th}>
                  <Text width="280px" lineHeight={1.5}>
                    {item.product_name}
                  </Text>
                </Td>
                <Td {...css.th}>{item.barcode}</Td>
                <Td {...css.th}>
                  <Input
                    name={`items[${index}].expected_amount`}
                    control={control}
                    errors={errors}
                    inputProps={{
                      type: "number",
                      min: 1,
                      defaultValue: item.expected_amount,
                      width: "100px",
                    }}
                  />
                </Td>
                <Td {...css.th}>
                  <Input
                    name={`items[${index}].cost`}
                    control={control}
                    errors={errors}
                    inputProps={{
                      min: 1,
                      defaultValue: item.expected_amount,
                      width: "200px",
                      type: "number",
                    }}
                  />
                </Td>
                <Td {...css.th}>
                  <Input
                    name={`items[${index}].discount`}
                    control={control}
                    errors={errors}
                    inputProps={{
                      type: "number",
                      min: 1,
                      max: 100,
                      defaultValue: item.expected_amount,
                      width: "100px",
                    }}
                  />
                </Td>
                <Td {...css.th}>
                  {watch(`items[${index}].cost`) *
                    watch(`items[${index}].expected_amount`) -
                    (watch(`items[${index}].discount`) / 100) *
                      watch(`items[${index}].cost`) *
                      watch(`items[${index}].expected_amount`)}
                </Td>
                <Td>
                  <Button
                    variant="link"
                    onClick={() =>
                      setValue(
                        "items",
                        getValues("items").filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Image
                      maxHeight="24px"
                      width="24px"
                      src={DeleteIcon}
                      alt="edit"
                      cursor="pointer"
                    />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default OrderProducts;

const css = {
  th: {
    color: "colors.text",
    textTransform: "none",
    fontWeight: "600",
    padding: "20px 20px",
    fontSize: "15px",
    border: "none !important",
  },
};

OrderProducts.propTypes = {
  setValue: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  control: PropTypes.shape({}).isRequired,
  watch: PropTypes.func.isRequired,
};
