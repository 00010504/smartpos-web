import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Drawer from "@/components/molecules/Drawer";
import { getOrder } from "@/services";
import priceFormatter from "@/helpers/priceFormatter";
import EditIcon from "@/assets/edit-outline.svg";
import CardIcon from "@/assets/card-outline.svg";
import PrintIcon from "@/assets/print.svg";
import CashIcon from "@/assets/icons/cash.svg";
// import DeleteIcon from "@/assets/delete-outline.svg";

function SaleView({ saleId, setSaleId }) {
  const [order, setOrder] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (saleId) {
      getOrder(saleId).then((res) => {
        setOrder(res);
      });
    }
  }, [saleId]);

  return (
    order && (
      <Drawer
        size="md"
        isOpen={!!saleId}
        onClose={() => {
          setSaleId("");
          setOrder(false);
        }}
        Header={
          <Box>
            <Heading color="colors.headingColor" size="md" fontWeight={600}>
              {t("sale")} #{order.external_id}
            </Heading>
            <Text color="#BDBDBD" fontSize="14px" fontWeight={400} mt="2px">
              {order.create_time &&
                format(parseISO(order.create_time), "dd.MM.yyyy | HH:mm:ss")}
            </Text>
          </Box>
        }
        Body={
          <Box>
            <SimpleGrid columns={2} gap="18px">
              <Box {...styles.box}>
                <Text {...styles.boxLabel}>{t("amount")}</Text>
                <Text {...styles.boxText}>
                  {priceFormatter(order.total_pirce)} {t("sum")}
                </Text>
              </Box>
              {/* {order?.discount?.price && (
                <Box {...styles.box}>
                  <Text {...styles.boxLabel}>{t("discount")}</Text>
                  <Text {...styles.boxText}>
                    {priceFormatter(order.discount.price)}
                  </Text>
                </Box>
              )} */}
              {order.client.first_name && (
                <Box {...styles.box}>
                  <Text {...styles.boxLabel}>{t("client")}</Text>
                  <Text {...styles.boxText}>
                    {`${order.client.first_name} ${order.client.last_name}`}
                  </Text>
                </Box>
              )}

              <Box {...styles.box}>
                <Text {...styles.boxLabel}>{t("store")}</Text>
                <Text {...styles.boxText}>{order.shop.title}</Text>
              </Box>
            </SimpleGrid>
            <hr
              style={{
                margin: "25px 0",
                border: "none",
                height: "2px",
                borderBottom: "2px dashed",
                borderColor: "var(--ck-colors-colors-greyD9)",
              }}
            />
            <SimpleGrid columns={2} gap="24px">
              {order.pays?.map((pay) => {
                return (
                  <Box {...styles.box} p="20px">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>
                        <Text
                          {...styles.boxLabel}
                          color="colors.grey45"
                          fontWeight={600}
                          fontSize="15px"
                        >
                          {pay.payment_type.company_id}
                        </Text>
                        <Text color="#256DF6" fontSize="19px" fontWeight={600}>
                          {priceFormatter(pay.value)} {t("sum")}
                        </Text>
                      </Box>
                      <Box
                        width="42px"
                        height="42px"
                        bg="colors.sidebar"
                        borderRadius="10px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Image
                          width="70%"
                          src={
                            pay.payment_type.company_id !== "CASH"
                              ? CardIcon
                              : CashIcon
                          }
                          alt=""
                        />
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </SimpleGrid>
            <hr
              style={{
                margin: "25px 0",
                border: "none",
                height: "2px",
                borderBottom: "2px dashed",
                borderColor: "var(--ck-colors-colors-greyD9)",
              }}
            />
            <SimpleGrid gap="16px">
              {order.items?.map((item) => {
                return (
                  <Box {...styles.box} p="12px 16px">
                    <SimpleGrid
                      gridTemplateColumns="60% 30%"
                      justifyContent="space-between"
                    >
                      <Heading
                        mb="6px"
                        size="sm"
                        color="colors.icon"
                        fontSize="17px"
                      >
                        {item.product_name}
                      </Heading>
                      <Text
                        textAlign="right"
                        color="brand.500"
                        fontWeight={600}
                      >
                        {priceFormatter(item.price)} {t("sum")}
                      </Text>
                    </SimpleGrid>
                    <Text
                      fontSize="14px"
                      color="colors.headingColor"
                      fontWeight={600}
                    >
                      {item.mxik_code} / {item.sku}
                    </Text>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        }
        Footer={
          <SimpleGrid
            width="100%"
            gridTemplateColumns="0.8fr 1.2fr 1fr"
            gap="20px"
          >
            <Button
              colorScheme="gray"
              bg="colors.grayF9"
              height="48px"
              color="#EB5757"
            >
              {t("delete")}
            </Button>
            <Button
              colorScheme="gray"
              bg="colors.grayF9"
              height="48px"
              color="brand.500"
              rightIcon={<Image src={EditIcon} />}
            >
              {t("edit")}
            </Button>

            <Button
              color="#fff"
              height="48px"
              rightIcon={<Image src={PrintIcon} />}
            >
              {t("print")}
            </Button>
          </SimpleGrid>
        }
      />
    )
  );
}

export default SaleView;

SaleView.propTypes = {
  saleId: PropTypes.string.isRequired,
  setSaleId: PropTypes.func.isRequired,
};

const styles = {
  box: {
    bg: "colors.grayF9",
    borderRadius: "10px",
    p: "10px 18px",
  },
  boxLabel: {
    fontSize: "14px",
    color: "colors.icon",
  },
  boxText: {
    color: "colors.text",
    fontSize: "16px",
    mt: "2px",
    fontWeight: 600,
  },
};
