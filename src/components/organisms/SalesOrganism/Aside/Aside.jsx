import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getOrderQuery } from "@/queries";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import useSection from "@/hooks/useSection";
import priceFormatter from "@/helpers/priceFormatter";
import { APPLY_MANUAL_DISCOUNTS } from "@/constants/permissions";
import Can from "@/hoc/Can";
import AddDiscount from "./AddDiscount";
import AddClient from "./AddClient";
import { discountTypes } from "./data";

export default function Aside() {
  const order = JSON.parse(localStorage.getItem("order") || "{}");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const section = useSection();

  const { data: currentOrder } = useQuery({
    ...getOrderQuery(order?.id),
    enabled: !!order?.id,
  });

  const getDiscountedPrice = () => {
    if (currentOrder) {
      const { total_pirce, discount } = currentOrder;
      if (discount.type === "1fe92aa8-2a61-4bf1-b907-182b497584ad") {
        return total_pirce - (total_pirce * discount.value) / 100;
      }
      return total_pirce - discount.value;
    }
    return 0;
  };

  return (
    <Flex
      direction="column"
      position="fixed"
      top="0"
      right="0"
      boxShadow="0px 0px 30px rgba(0, 0, 0, 0.08)"
      p="36px 32px"
      width="27%"
      height="100vh"
      borderTopLeftRadius="30px"
      borderBottomLeftRadius="30px"
      zIndex="docked"
      bg="colors.sidebar"
    >
      <Flex justifyContent="space-between" alignItems="center" mb="30px">
        <Heading>{t("sale")}</Heading>
        <Heading size="lg" color="#BDBDBD">
          {currentOrder?.external_id ? `#${currentOrder.external_id}` : ""}
        </Heading>
      </Flex>
      <SimpleGrid direction="column" gap="24px">
        <AddClient />
        {currentOrder?.total_pirce > 0 && (
          <Flex {...styles.discount}>
            <Flex alignItems="center">
              <FormLabel color="colors.greyF9" fontWeight={600} mb={0}>
                {t("discount").toUpperCase()}
              </FormLabel>
              <Text {...styles.kdb}>D</Text>
            </Flex>
            <Can I={APPLY_MANUAL_DISCOUNTS} a={section}>
              <AddDiscount orderAmount={currentOrder.total_pirce} />
            </Can>
          </Flex>
        )}
      </SimpleGrid>
      <Flex
        my="30px"
        fontWeight={600}
        justifyContent="space-between"
        color="colors.icon"
        fontSize="20px"
      >
        <Text>{t("discount")}</Text>
        <Text>
          {priceFormatter(currentOrder?.discount.value || 0)}{" "}
          {
            discountTypes.map(
              (type) => type.value === currentOrder?.discount.type,
            ).value
          }
          {currentOrder?.discount.type ===
          "1fe92aa8-2a61-4bf1-b907-182b497584ad"
            ? t("%")
            : t("sum")}
        </Text>
      </Flex>
      <Spacer />
      <SimpleGrid gap="15px">
        <Box
          p="16px"
          bg="colors.grayF9"
          border="2px solid"
          borderColor="colors.sidebarBorder"
          borderRadius="15px"
          fontWeight={700}
        >
          <Flex justifyContent="space-between" color="colors.grey45">
            <Text>{t("subtotal")}</Text>
            <Text>
              {priceFormatter(currentOrder?.total_pirce)} {t("uzs")}
            </Text>
          </Flex>
          <Flex mt="10px" justifyContent="space-between" color="colors.grey45">
            <Text>{t("discount")}</Text>
            <Text>
              {priceFormatter(currentOrder?.discount.value || 0)}{" "}
              {currentOrder?.discount.type ===
              "1fe92aa8-2a61-4bf1-b907-182b497584ad"
                ? t("%")
                : t("sum")}
            </Text>
          </Flex>
        </Box>
        <Button
          size="lg"
          isDisabled={!currentOrder?.items?.length}
          onClick={() => navigate("/sales/new-sale/payment")}
          mt={6}
          borderRadius="20px"
          height="60px"
          display="flex"
          justifyContent="space-between"
          color="#fff"
        >
          <Text as="span">
            {t("pay")}{" "}
            <Text
              as="span"
              {...styles.kdb}
              ml="5px"
              display="inline-block"
              width="24px"
              height="24px"
              pt="3.5px"
              color="#fff"
              borderColor="#fff"
            >
              F5
            </Text>
          </Text>
          <Text as="span">
            {priceFormatter(getDiscountedPrice())} {t("uzs")}
          </Text>
        </Button>
      </SimpleGrid>
    </Flex>
  );
}

const styles = {
  kdb: {
    mt: "-1px",
    as: "span",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    border: "2px solid #BDBDBD",
    color: "#BDBDBD",
    fontWeight: 700,
    pt: "2px",
    pl: "1px",
    borderRadius: "6px",
  },
  discount: {
    display: "flex",
    justifyContent: "space-between",
    p: "16px",
    background: "colors.grayF9",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "15px",
  },
  input: {
    p: "27px 16px",
    background: "colors.grayF9",
    border: "2px solid #EFF0F6",
    borderRadius: "15px",
    _placeholder: {
      color: "#BDBDBD !important",
    },
  },
};
