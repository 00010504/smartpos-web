import { useTranslation } from "react-i18next";
import { Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ImgUpload from "@/components/molecules/Upload/ImgUpload";
import { useLangContext } from "@/contexts/langContext";
import QRCode from "react-qr-code";
import ImagePlaceholder from "@/assets/images/logo-placeholder.png";
import { commonCSS, rCSS } from "./data";

function Receipt({ state, setImage, previewImage }) {
  const { lang } = useLangContext();
  const { t } = useTranslation();

  return (
    <Box {...commonCSS.wrapper}>
      <Box {...rCSS.cheque}>
        <ImgUpload
          label={t("your_logo_here")}
          styleProp={{ border: "1px solid #d9d9d9" }}
          setImg={previewImage}
          img={state.logo?.image || ImagePlaceholder}
          onChangePosition={(e) =>
            setImage({
              top: e.top,
              left: e.left,
            })
          }
          onChangeSize={(e) =>
            setImage({
              right: e.right || 300,
              bottom: e.bottom || 120,
            })
          }
          deleteImage={() => setImage({ image: null })}
          logoSize={state.logo}
        />

        <Box {...rCSS.content}>
          {state.blocks?.[0]?.fields?.map(
            (field) =>
              field.is_added && (
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
          {state.blocks?.[1]?.fields.filter(
            (field) => field.name === "qr code",
          )[0]?.is_added && (
            <Box width="50%" margin="10px auto">
              <QRCode
                size={156}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value="example of qr code"
                viewBox="0 0 256 256"
              />
            </Box>
          )}
          {state.message && (
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

export default Receipt;

Receipt.propTypes = {
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
  setImage: PropTypes.func.isRequired,
  previewImage: PropTypes.func.isRequired,
};
