import { Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import box from "@/assets/images/sale/opened-box.svg";

export default function EmptyBasket() {
  const { t } = useTranslation();

  return (
    <VStack {...boxSx}>
      <Image src={box} alt="box" />
      <Heading size="lg">{t("card_is_currently_empty")}</Heading>
      <Text
        fontSize="lg"
        fontWeight="600"
        color="#BDBDBD"
        textAlign="center"
        p="0 20%"
      >
        {t("click_f_to_search")}
      </Text>
    </VStack>
  );
}

const boxSx = {
  bg: "colors.sidebar",
  h: "100%",
  w: "100%",
  border: "2px solid",
  borderColor: "colors.sidebarBorder",
  borderRadius: "20px",
  spacing: 4,
  justifyContent: "center",
};
