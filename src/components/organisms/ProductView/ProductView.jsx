import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Th,
  Tbody,
  Td,
  Tr,
  TableContainer,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Drawer from "@/components/molecules/Drawer";
import Image from "@/components/atoms/Image";
import { getProduct, getProductHistory } from "@/services";
import {
  css,
  mergeBy,
} from "./data"; /* eslint-disable react/no-array-index-key */

function ProductView({ id, onClose }) {
  const [singleProduct, setSingleProduct] = useState();
  const [productHistory, setProductHistory] = useState([]);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const infoRows = useMemo(() => {
    if (singleProduct?.measurement_values && singleProduct?.shop_prices) {
      return mergeBy(
        "shop_id",
        singleProduct?.measurement_values,
        singleProduct?.shop_prices,
      );
    }
    return [];
  }, [singleProduct?.measurement_values, singleProduct?.shop_prices]);

  useEffect(() => {
    if (id) {
      getProduct(id).then((res) => {
        setSingleProduct(res);
      });
      getProductHistory(id).then((res) => {
        setProductHistory(res.product_history);
      });
    }
  }, [id]);

  return (
    <Drawer
      size="xl"
      isOpen={!!(id && singleProduct)}
      onClose={() => {
        onClose();
        setSingleProduct("");
      }}
      Header={<Heading size="lg">{t("product_details")}</Heading>}
      Body={
        singleProduct ? (
          <Box mt="12px">
            <SimpleGrid {...css.productInfoGrid}>
              <Box {...css.imageWrapper}>
                <Image
                  props={{
                    src: singleProduct?.images[0]?.image_url,
                    alt: singleProduct.name,
                  }}
                  styles={css.image}
                />
              </Box>
              <Box>
                <Heading {...css.productName}>{singleProduct.name}</Heading>
                <Text mb="4px" fontSize="15px">
                  <Text mr="6px" as="span" fontWeight={500} color="#BDBDBD">
                    {t("barcode")}:
                  </Text>
                  <Text as="span" fontWeight={500} color="#454545">
                    {singleProduct.barcodes[0]}
                  </Text>
                </Text>
                <Text fontSize="15px">
                  <Text mr="6px" as="span" fontWeight={500} color="#BDBDBD">
                    {t("sku")}:
                  </Text>
                  <Text as="span" fontWeight={500} color="#454545">
                    {singleProduct.sku}
                  </Text>
                </Text>
                {/* <Text fontSize="15px">
                  <Text mr="6px" as="span" fontWeight={500} color="#BDBDBD">
                    Category:
                  </Text>
                  <Text as="span" fontWeight={500} color="#454545">
                    No category
                  </Text>
                </Text> */}
              </Box>
            </SimpleGrid>
            <Tabs my="30px" borderBottom="none">
              <TabList
                margin="0 auto"
                borderBottom="none"
                border="2px solid"
                borderColor="colors.grayF9 !important"
                borderRadius="10px"
                overflow="hidden"
              >
                <Tab
                  w="50%"
                  _selected={{ bg: "colors.grayF9", borderBottom: "none" }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  position="relative"
                  _before={{
                    content: "''",
                    position: "absolute",
                    top: "50%",
                    left: "-50px",
                    transform: "translateY(-50%)",
                    width: "50px",
                    height: "5px",
                    background: "#D9D9D9",
                  }}
                >
                  {t("information")}
                </Tab>
                <Tab
                  flexGrow="1"
                  _selected={{ bg: "colors.grayF9", borderBottom: "none" }}
                  p="11px 0px"
                >
                  {t("inventory_history")}
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p="40px 0">
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th width="120px" {...css.th}>
                            {t("store")}
                          </Th>
                          <Th {...css.th}>{t("available")}</Th>
                          <Th {...css.th}>{t("amount")}</Th>
                          <Th {...css.th}>{t("low_stock")}</Th>
                          <Th {...css.th}>{t("supply_price")}</Th>
                          <Th {...css.th}>{t("margin")}</Th>
                          <Th {...css.th}>{t("retail_price")}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {infoRows.map((item) => (
                          <Tr key={item.shop_id}>
                            <Td
                              borderBottom="none"
                              fontWeight={600}
                              color="colors.link"
                            >
                              {item.shop_name}
                            </Td>
                            <Td borderBottom="none">
                              {item.is_available ? t("yes") : t("no")}
                            </Td>
                            <Td borderBottom="none">{item.amount}</Td>
                            <Td borderBottom="none">{item.small_left}</Td>

                            <Td borderBottom="none">{item.supply_price}</Td>
                            <Td borderBottom="none">
                              {Math.round(
                                (item.retail_price / item.supply_price - 1) *
                                  100,
                              ) > 0
                                ? Math.round(
                                    (item.retail_price / item.supply_price -
                                      1) *
                                      100,
                                  )
                                : 0}
                              %
                            </Td>
                            <Td borderBottom="none">{item.retail_price}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel p="40px 0">
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th width="120px" {...css.th}>
                            {t("action")}
                          </Th>
                          <Th {...css.th}>{t("date")}</Th>
                          <Th {...css.th}>{t("quantity")}</Th>
                          <Th {...css.th}>{t("store")}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {productHistory?.map((product, index) => (
                          <Tr key={index}>
                            <Td
                              borderBottom="none"
                              fontWeight={600}
                              color="colors.link"
                            >
                              {`${product.product_action_name} #${product.external_id}`}
                            </Td>
                            <Td borderBottom="none">
                              {format(
                                new Date(product.created_at),
                                "dd.MM.yyyy HH:mm:ss",
                              )}
                            </Td>
                            <Td borderBottom="none">{product.quantity}</Td>
                            <Td borderBottom="none">{product.shop_name}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        ) : (
          <Box />
        )
      }
      Footer={
        <SimpleGrid columns={2} gap="18px" width="100%">
          <Button height="50px" color="brand.500" colorScheme="gray">
            {t("pricing_tags")}
          </Button>
          <Button
            height="50px"
            width="100%"
            color="brand.500"
            colorScheme="gray"
            onClick={() => {
              navigate(`edit/${singleProduct.id}`);
              onClose();
            }}
          >
            {t("edit")}
          </Button>
        </SimpleGrid>
      }
    />
  );
}

export default ProductView;

ProductView.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
