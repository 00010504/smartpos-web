import { Box, Image, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import QRCode from "react-qr-code";
import priceFormatter from "@/helpers/priceFormatter";
import { getOrderQuery, getReceiptQuery } from "@/queries";
import LocalStorage from "@/utils/LocalStorage";
import { useLangContext } from "@/contexts/langContext";
import { rCSS } from "../../SettingsTemplates/CreateReceipt/data";

function Cheque() {
  const { lang } = useLangContext();
  const order_id = LocalStorage.order?.id ?? "";
  const { t } = useTranslation();

  const { data: currentOrder } = useQuery({
    ...getOrderQuery(order_id),
    enabled: !!order_id,
  });

  const { data: cheque } = useQuery({
    ...getReceiptQuery(currentOrder?.cheque?.id),
    enabled: !!currentOrder?.cheque?.id,
  });

  const chequeData = {
    "shop name": currentOrder?.shop.title,
    datetime: format(parseISO(new Date().toISOString()), "dd/MM/yyyy - HH:mm"),
    seller: t("not_filled"),
    cashier: `${currentOrder?.created_by.first_name} ${currentOrder?.created_by.last_name}`,
    customer: currentOrder?.client.first_name
      ? `${currentOrder?.client.first_name} ${currentOrder?.client.last_name}`
      : t("not_filled"),
    contacts: t("not_filled"),
  };

  return (
    <Box {...rCSS.cheque} width="100%">
      {cheque?.logo?.image && (
        <Box
          position="relative"
          height={`${cheque.logo.bottom - 10}px`}
          width={`${cheque.logo.right}px`}
        >
          <Image
            position="absolute"
            top={`${cheque.logo.top}px`}
            left={`${cheque.logo.left}px`}
            height={`${cheque.logo.bottom - 15}px`}
            width={`${cheque.logo.right - 10}px`}
            src={cheque.logo?.image}
            alt=""
            objectFit="contain"
            draggable={false}
          />
        </Box>
      )}
      <Box {...rCSS.content}>
        {cheque?.blocks?.[0]?.fields?.map(
          (field) =>
            field.is_added && (
              <Box key={field.id} {...rCSS.flex}>
                <Text fontWeight={700}>{field.name_translation[lang]}:</Text>
                <Text textAlign="right">{chequeData[field.name]}</Text>
              </Box>
            ),
        )}
      </Box>
      <Box {...rCSS.content}>
        {currentOrder.items?.map((item, i) => {
          return (
            <Box mb="5px" key={item.id}>
              <Text fontSize="15px" fontWeight={700}>
                {i + 1}. {item.product_name}
              </Text>
              <Text>
                {item.value} {t("pcs")} -{" "}
                {priceFormatter(item.price * item.value)} {t("sum")}
              </Text>
            </Box>
          );
        })}
        <Box {...rCSS.content}>
          <Box {...rCSS.flex}>
            <Text fontSize="15px" fontWeight={700}>
              {t("subtotal")}:
            </Text>
            <Text>
              {priceFormatter(
                currentOrder.total_pirce - currentOrder.discount.price,
              )}{" "}
              {` ${t("sum")}`}
            </Text>
          </Box>
          <Box {...rCSS.flex}>
            <Text fontSize="15px" fontWeight={700}>
              {t("discount")}:
            </Text>
            <Text>
              {currentOrder.discount?.price
                ? priceFormatter(currentOrder.discount.price)
                : 0}{" "}
              {t("sum")}
            </Text>
          </Box>
          <Box {...rCSS.flex} mb="10px">
            <Text fontSize="18px" fontWeight={700}>
              {t("all")}:
            </Text>
            <Text>
              {priceFormatter(currentOrder.total_pirce)} {` ${t("sum")}`}
            </Text>
          </Box>
        </Box>
      </Box>
      {cheque?.blocks?.[1]?.fields.filter(
        (field) => field.name === "qr code",
      )[0]?.is_added && (
        <Box width="60%" margin="10px auto">
          <QRCode
            size={156}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={currentOrder?.id}
            viewBox="0 0 256 256"
          />
        </Box>
      )}
      {cheque?.message && (
        <Text
          fontSize="14px"
          mt="8px"
          textAlign="center"
          as="i"
          display="block"
        >
          {cheque?.message}
        </Text>
      )}
    </Box>
  );
}

export default Cheque;
