/* eslint-disable no-param-reassign */

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCashboxQuery, getOrderQuery } from "@/queries";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import useToast from "@/hooks/useToast";
import useIframe from "@/hooks/useIframe";
import { orderPayment } from "@/services";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import priceFormatter from "@/helpers/priceFormatter";
import LocalStorage from "@/utils/LocalStorage";
import GoBack from "@/components/molecules/GoBack";
import Addicon from "@/assets/payment-type-add.svg";
import Cheque from "./Cheque";

const printPdf = async (url, iframe) => {
  const file = await fetch(url).then((res) => res.blob());
  const fileURL = URL.createObjectURL(file);
  // setIframeSrc(fileURL);
  iframe.onload = () => {
    iframe.contentWindow.print();
  };
  iframe.src = fileURL;
};

export default function SalesPayment() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // const setIframeSrc = useIframe(
  //   useCallback(() => {
  //     this.contentWindow.print();
  //     console.log("should print");
  //   }, []),
  // );
  const iframe = useIframe();

  const order = LocalStorage.order ?? {};

  const { data: currentOrder } = useQuery({
    ...getOrderQuery(order.id),
    enabled: !!order.id,
  });

  const { data: cashbox } = useQuery({
    ...getCashboxQuery(order?.cashbox?.id),
    enabled: !!order?.cashbox?.id,
  });

  const allPayment =
    paymentTypes?.reduce((partialSum, obj) => partialSum + obj.value, 0) ??
    getDiscountedPrice();

  const addPaymentType = (paymentType) => {
    if (currentOrder) {
      setPaymentTypes((previous) => {
        return [
          ...previous,
          {
            payment_type_id: paymentType.id,
            name: paymentType.name,
            value: getDiscountedPrice() - allPayment,
          },
        ];
      });
    }
  };

  const onPay = async () => {
    setLoading(true);
    const res = await orderPayment({
      pays: paymentTypes.map((ty) => {
        return {
          ...ty,
          value: +ty.value,
        };
      }),
      order_id: order?.id,
    });

    LocalStorage.set("order", "");

    addToast({
      status: "success",
      title: t("sale_made_successfully"),
    });

    queryClient.invalidateQueries("sales");

    navigate("/sales/new-sale");

    await printPdf(res.pdf, iframe);
  };

  const availablePayment = () => {
    const temp = [];
    cashbox?.payment_types?.map((type) => {
      if (
        paymentTypes?.every((selectedType) => {
          return type.name !== selectedType.name;
        })
      ) {
        temp.push(type);
      }
      return null;
    });
    return temp;
  };

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
    <Box width="85%" margin="0 auto">
      <GoBack title={t("payment_type")} isDirty={false} backUrl={-1} />
      {currentOrder && (
        <Grid
          templateRows="repeat(3, 1fr)"
          templateColumns="repeat(6, 1fr)"
          border="3px solid"
          borderColor="colors.sidebarBorder"
          borderRadius="20px"
          overflow="hidden"
        >
          <GridItem
            bg="colors.grayF9"
            rowSpan={3}
            colSpan={2}
            p="30px"
            position="relative"
            maxHeight="600px"
            overflow="auto"
            borderRight="3px solid"
            borderColor="colors.sidebarBorder"
          >
            <Cheque />
          </GridItem>
          <GridItem
            colSpan={4}
            padding="30px 50px"
            borderBottom="3px solid"
            borderColor="colors.sidebarBorder"
          >
            <Center h="100%" display="flex" justifyContent="space-between">
              <Box
                border="3px solid"
                borderColor="colors.sidebarBorder"
                p={6}
                width="47%"
                borderRadius="2xl"
                background="colors.grayF9"
              >
                <Text fontSize="lg" fontWeight="600" color="colors.greyD9">
                  {t("total")}:
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="colors.text">
                  {`${priceFormatter(getDiscountedPrice())} ${t("sum")}`}
                </Text>
              </Box>
              <Box
                border="3px solid"
                p={6}
                width="47%"
                borderRadius="2xl"
                bg={getDiscountedPrice() >= +allPayment ? "#6FCF97" : "#EB5757"}
                borderColor={
                  getDiscountedPrice() >= +allPayment ? "#6FCF97" : "#EB5757"
                }
                color="#fff"
              >
                <Text fontSize="lg" fontWeight="bold">
                  {getDiscountedPrice() >= +allPayment
                    ? t("to_pay")
                    : t("charge")}
                </Text>
                <Text fontSize="4xl" fontWeight="bold">
                  {`${priceFormatter(
                    currentOrder && (getDiscountedPrice() - allPayment || 0),
                  )} ${t("sum")}`}
                </Text>
              </Box>
            </Center>
          </GridItem>
          <GridItem
            colSpan={3}
            rowSpan={2}
            borderRight="3px solid"
            borderColor="colors.sidebarBorder"
            p="22px 30px"
            pb={0}
          >
            <SimpleGrid columns={2} gap="26px" height="350px" overflow="auto">
              {paymentTypes?.map((type, i) => {
                return (
                  <Box
                    borderRadius="15px"
                    overflow="hidden"
                    key={type.name}
                    border="2px solid"
                    borderColor="colors.sidebarBorder"
                    height="150px"
                  >
                    <Heading
                      size="md"
                      p="12px 15px"
                      bg="colors.grayF9"
                      pt="14px"
                      position="relative"
                    >
                      {type.name}
                      <CloseIcon
                        width="12px"
                        position="absolute"
                        right="20px"
                        cursor="pointer"
                        color="#BDBDBD"
                        onClick={() => {
                          const previous = paymentTypes.filter(
                            (ty) => ty.name !== type.name,
                          );
                          setPaymentTypes(previous);
                        }}
                      />
                    </Heading>
                    <Box
                      padding="32px 0"
                      textAlign="center"
                      fontWeight={700}
                      color="#454545"
                      fontSize="18px"
                    >
                      <NumberInput
                        value={type.value || 0}
                        onChange={(value) => {
                          const temp = [...paymentTypes];
                          temp[i].value = +value;
                          setPaymentTypes(temp);
                        }}
                        min={0}
                      >
                        <NumberInputField
                          fontSize="18px"
                          bg="#f8f8f8"
                          mr={2}
                          placeholder="0"
                          width="55%"
                          border="none"
                        />{" "}
                        <Text as="span">UZS</Text>
                      </NumberInput>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </GridItem>
          <GridItem colSpan={1} rowSpan={2} p="22px 30px">
            <SimpleGrid gap="15px" overflow="auto" height="280px">
              {availablePayment()?.map((paymentType) => {
                return (
                  <Flex
                    p="8px 18px"
                    pr="10px"
                    border="2px solid"
                    borderColor="colors.sidebarBorder"
                    bg="colors.grayF9"
                    borderRadius="15px"
                    fontWeight={600}
                    color="colors.text"
                    fontSize="18px"
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={() => {
                      if (paymentType.is_added) {
                        addPaymentType(paymentType);
                      }
                    }}
                    key={paymentType.id}
                    height="60px"
                    opacity={!paymentType.is_added ? 0.3 : 1}
                    cursor={!paymentType.is_added ? "not-allowed" : "auto"}
                  >
                    <Text>{paymentType.name}</Text>
                    <Button p="10px" height="40px" variant="link">
                      <Image cursor="pointer" src={Addicon} alt="add" />
                    </Button>
                  </Flex>
                );
              })}
            </SimpleGrid>
            <Button
              colorScheme="blue"
              bg="brand.500"
              color="#fff"
              height="55px"
              width="100%"
              fontSize="18px"
              transform="translateY(30px)"
              isDisabled={getDiscountedPrice() > +allPayment}
              onClick={onPay}
              isLoading={loading}
            >
              {t("pay")}
            </Button>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
}
