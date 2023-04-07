import { useTranslation } from "react-i18next";
import { Box, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useLangContext } from "@/contexts/langContext";
import Barcode from "@/assets/images/barcode.gif";
import { commonCSS, rCSS } from "./data";

function ReceiptCard({ state }) {
  const { lang } = useLangContext();
  const { t } = useTranslation();

  return (
    <Box {...commonCSS.wrapper}>
      <Box {...rCSS.cheque}>
        <Image
          src={state.logo?.image}
          alt=""
          style={{
            position: "absolute",
            top: state.logo?.top,
            left: state.logo?.left,
            width: state.logo?.right,
            height: state.logo?.bottom,
          }}
        />

        <Box {...rCSS.content}>
          {state.blocks?.[0]?.fields?.map(
            (field) =>
              field.is_added &&
              state.blocks[0].is_active && (
                <Box key={field.id} {...rCSS.flex}>
                  <Text fontWeight={700}>{field.name_translation[lang]}:</Text>
                  <Text>{t("text")}</Text>
                </Box>
              ),
          )}
        </Box>
        <Box {...rCSS.content}>
          <Box mb="5px">
            <Text fontSize="15px" fontWeight={700}>
              1. Смарт часы HIwatch Pro T800 Ultra Orange
            </Text>
            <Text>
              2 {t("pcs")} (847 500 {t("sum")})
            </Text>
          </Box>
          <Box mb="5px">
            <Text fontSize="15px" fontWeight={700}>
              2. Смартфон Xiaomi Redmi Note 11 Pro 8/128 GB Gray
            </Text>
            <Text>
              1 {t("pcs")} (3 086 000 {t("sum")})
            </Text>
          </Box>
        </Box>
        <Box {...rCSS.content}>
          <Box {...rCSS.flex}>
            <Text fontSize="15px" fontWeight={700}>
              {t("subtotal")}:
            </Text>
            <Text>3 927 500 {t("sum")}</Text>
          </Box>
          <Box {...rCSS.flex}>
            <Text fontSize="15px" fontWeight={700}>
              {t("discount")}:
            </Text>
            <Text>0 {t("sum")}</Text>
          </Box>
          <Box {...rCSS.flex} mb="10px">
            <Text fontSize="18px" fontWeight={700}>
              {t("all")}:
            </Text>
            <Text>3 927 500 {t("sum")}</Text>
          </Box>
          <Image
            h="60px"
            w="100%"
            objectFit="cover"
            objectPosition="bottom"
            src={Barcode}
            alt="barcode"
          />
          {state.blocks[1]?.is_active && (
            <Text
              fontSize="14px"
              mt="8px"
              textAlign="center"
              as="i"
              display="block"
            >
              {state.message}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ReceiptCard;

ReceiptCard.propTypes = {
  state: PropTypes.shape({
    message: PropTypes.string,
    logo: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      image: PropTypes.string,
    }),
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        is_active: PropTypes.bool,
        fields: PropTypes.arrayOf(PropTypes.shape({})),
      }),
    ),
  }).isRequired,
};
