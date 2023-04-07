import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Bg from "@/assets/images/create-account/create-account-bg.png";
import CreateAccountsCards from "./CreateAccountsCards/CreateAccountsCards";
import CreateAccountsForm from "./CreateAccountsForm/CreateAccountsForm";

function CreateAccountsComponent() {
  const { t } = useTranslation();

  return (
    <Box mb={12}>
      <Box
        className="bg-cover bg-no-repeat bg-center rounded-b-3xl"
        height="350px"
        backgroundImage={`linear-gradient(
        to bottom,
        rgba(21, 101, 216, 0.85),
        rgba(21, 101, 216, 0.85)
      ),
      url(${Bg});`}
      />
      <Box
        margin="0 auto"
        width="1000px"
        marginTop="-260px"
        className="text-center"
      >
        <Text className="text-3xl text-white font-bold mb-4">
          {t("lets_create_your_account")}
        </Text>
        <Text className="text-white">{t("signing_up_text")}</Text>
        <CreateAccountsCards />
        <CreateAccountsForm />
      </Box>
    </Box>
  );
}

export default CreateAccountsComponent;
