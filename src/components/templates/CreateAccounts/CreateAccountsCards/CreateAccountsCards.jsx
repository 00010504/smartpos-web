import { Grid, GridItem, Box, Text, Img } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SetupIcon from "@/assets/images/create-account/setup.svg";
import PriceIcon from "@/assets/images/create-account/price.svg";
import SupportIcon from "@/assets/images/create-account/support.svg";

function CreateAccountsCards() {
  const { t } = useTranslation();

  return (
    <Grid className="mt-10" {...boxContainerStyles}>
      <GridItem>
        <Box className="rounded-2xl" {...boxStyles}>
          <Box height="90px">
            <Img
              width="70px"
              height="70px"
              src={SetupIcon}
              alt=""
              className="m-auto"
            />
          </Box>
          <Text className="mb-3 text-xl font-bold">{t("quick_setup")}</Text>
          <Text>{t("signing_up_text")}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box bg="white" className="rounded-2xl" {...boxStyles}>
          <Box height="90px">
            <Img width="70px" src={PriceIcon} alt="" className="m-auto" />
          </Box>
          <Text className="mb-3 text-xl font-bold">{t("simple_pricing")}</Text>
          <Text>{t("signing_up_text")}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box className="rounded-2xl" {...boxStyles}>
          <Box height="90px">
            <Img width="60px" src={SupportIcon} alt="" className="m-auto" />
          </Box>
          <Text className="mb-3 text-xl font-bold">{t("supoort24_7")}</Text>
          <Text>{t("signing_up_text")}</Text>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default CreateAccountsCards;

const boxContainerStyles = {
  gap: "32px",
  gridTemplateColumns: "1fr 1fr 1fr",
};
const boxStyles = {
  boxShadow: "2px 2px 20px rgba(0, 0, 0, 0.08)",
  p: 10,
  bg: "colors.header",
};
