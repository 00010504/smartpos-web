import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import {
  deleteSupplierOrderItem,
  getSaleProducts,
  supplierOrderItem,
  supplierOrderStatus,
} from "@/services";
import Image from "@/components/atoms/Image";
import Search from "@/components/molecules/Input/Search";
import Empty from "@/components/molecules/Empty";
import { getSupplierOrderByIdQuery } from "@/queries";
import CreateSupplierOrderItemsTable from "./CreateSupplierOrderItemsTable";
import { css } from "./data"; /* eslint-disable react-hooks/exhaustive-deps */

function CreateSupplierOrderItems() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { supplier_order_id } = useParams();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
  });

  const [products, setProducts] = useState({
    data: [],
    total: 1,
  });
  const searchRef = useRef(null);

  const { data: order } = useQuery({
    ...getSupplierOrderByIdQuery(supplier_order_id),
  });

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, []);

  const addItem = (item) => {
    const cost = Object.values(item.shop_prices)[0].retail_price;
    const last_cost = cost;
    supplierOrderItem({
      supplier_order_id,
      product_id: item.id,
      expected_amount: 1,
      cost,
      last_cost,
    }).then(() => {
      queryClient.invalidateQueries(["supplier-order", supplier_order_id]);
      searchParams.set("search", "");
      searchRef.current.value = "";
      setProducts({
        data: [],
        total: 1,
      });
      getProducts();
    });
  };

  const updateItem = (item, fieldname, value) => {
    setLoading({ [item.id]: true });
    supplierOrderItem({
      supplier_order_id,
      ...item,
      [fieldname]: +value,
    })
      .then(() => {
        queryClient.invalidateQueries(["supplier-order", supplier_order_id]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeItem = (item) => {
    deleteSupplierOrderItem(item.id).then(() => {
      queryClient.invalidateQueries(["supplier-order", supplier_order_id]);
    });
  };

  const onSearchChange = (val) => {
    return debouncedSearch((prev) => {
      prev.set("search", val);
      return prev;
    });
  };

  const onClose = () => {
    setSearchParams((prev) => prev.delete("search"));
    if (searchRef.current) searchRef.current.value = "";
  };

  const onStatusChange = () => {
    supplierOrderStatus(supplier_order_id).then(() => {
      queryClient.invalidateQueries(["supplier-order", supplier_order_id]);
      queryClient.invalidateQueries(["supplier-orders"]);
      navigate("/products/orders");
    });
  };

  const getProducts = () => {
    if (searchRef.current?.value) {
      getSaleProducts({ search: searchParams.get("search") }).then((res) => {
        const items = res.data.filter(
          (item) =>
            !order?.items.find((orderItem) => orderItem.product_id === item.id),
        );
        setProducts({
          data: items,
          total: res.total,
        });
      });
    }
  };

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [order?.items, searchParams, searchRef.current?.value]);

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontWeight="600" fontSize="28px" mb={3}>
          {t("supplier_order")}
        </Heading>
        {order?.status?.name !== "Recieved" && (
          <Button
            minW="100px"
            height="45px"
            color="#fff"
            onClick={onStatusChange}
          >
            {t("save")}
          </Button>
        )}
      </Flex>
      <SimpleGrid {...css.grid}>
        <Flex {...css.textFlex}>
          <Text as="b">{t("supplier")}:</Text>
          <Text ml="10px">{order?.supplier_name.name}</Text>
        </Flex>
        <Flex {...css.textFlex}>
          <Text as="b">{t("aggreement")}:</Text>
          <Text ml="10px">{order?.invoice_number}</Text>
        </Flex>
        <Flex {...css.textFlex}>
          <Text as="b">{t("store")}:</Text>
          <Text ml="10px">{order?.shop.name}</Text>
        </Flex>
        <Flex {...css.textFlex}>
          <Text as="b">{t("created_at")}:</Text>
          <Text ml="10px">{order?.created_date?.slice(0, 10)}</Text>
        </Flex>
        <Flex {...css.textFlex}>
          <Text as="b">{t("expected_on")}:</Text>
          <Text ml="10px">{order?.expected_date?.slice(0, 10)}</Text>
        </Flex>
        <Flex {...css.textFlex}>
          <Text as="b">{t("comment")}:</Text>
          <Text ml="10px">{order?.note}</Text>
        </Flex>
      </SimpleGrid>
      {order?.status?.name !== "Recieved" && (
        <Box mb={8}>
          <FormLabel>Product name</FormLabel>
          <Popover
            matchWidth
            isOpen={
              searchRef &&
              searchRef.current &&
              searchRef.current.value.length > 0
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
            <PopoverContent
              bg="colors.body"
              width="100.9%"
              left="5px"
              borderRadius="10px"
            >
              <PopoverBody>
                {products?.data?.map((product) => (
                  <Flex
                    p={2}
                    key={product.id}
                    justifyContent="space-between"
                    borderRadius="8px"
                    _hover={{
                      bg: "colors.grayF9",
                    }}
                    onClick={() => addItem(product)}
                  >
                    <Flex gap="18px">
                      <Image
                        props={{
                          src: product?.image,
                          alt: product.name,
                        }}
                        styles={{
                          width: "50px",
                        }}
                      />
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
                        <Text
                          fontWeight={400}
                          pl="8px"
                          as="span"
                          textAlign="right"
                        >
                          UZS
                        </Text>
                      </Text>
                    </Box>
                  </Flex>
                ))}
                {products?.data?.length < 1 && (
                  <Box p={3} fontWeight={600}>
                    <Text textAlign="center">No products for adding</Text>
                  </Box>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      )}
      {order?.items.length < 1 ? (
        <Empty title={t("cart_is_currently_empty")} />
      ) : (
        <CreateSupplierOrderItemsTable
          order={order}
          updateItem={updateItem}
          removeItem={removeItem}
          loading={loading}
        />
      )}
    </>
  );
}

export default CreateSupplierOrderItems;
