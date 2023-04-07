import { Box, Grid, GridItem, Img, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoWhite from "@/assets/images/auth/logo-white.svg";
import BracketOpen from "@/assets/images/auth/bracket-open.svg";
import BracketClose from "@/assets/images/auth/bracket-close.svg";
import AuthBg from "@/assets/images/auth/auth-bg.webp";
import SignSection from "./SignInSection/SignSection";
import RegisterSection from "./RegisterSection/RegisterSection";
import ResetSection from "./ResetSection/ResetSection";
import LastStep from "./LastStep/LastStep";
import AuthLanguage from "./AuthLanguage/AuthLanguage";
import Verify from "./Verify/Verify";

function AuthComponent() {
  const { authType } = useParams();
  const { t } = useTranslation();

  return (
    <Grid gridTemplateColumns="1fr 1fr">
      <Img
        position="absolute"
        top="40px"
        left="60px"
        width="80px"
        src={LogoWhite}
        alt="SmartPOS"
      />
      <AuthLanguage />
      <Text
        position="absolute"
        top="45px"
        right="40px"
        className="text-blue-500 font-medium"
        fontWeight={500}
      >
        {t("learn_more")}
      </Text>
      <GridItem
        className="bg-cover bg-no-repeat h-screen items-center flex"
        backgroundImage={`linear-gradient(
        to bottom,
        rgba(21, 101, 216, 0.85),
        rgba(21, 101, 216, 0.85)
      ),
      url(${AuthBg});`}
      >
        <Box padding="0 12% 0 60px">
          <Img
            src={BracketOpen}
            width="60px"
            height="60px"
            className="mb-6"
            alt="quote"
          />
          <Text fontSize="2xl" opacity={0.9} color="white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </Text>
          <Img
            src={BracketClose}
            width="50px"
            height="50px"
            alt="quote"
            className="mt-10"
            marginLeft="auto"
          />
        </Box>
      </GridItem>
      <GridItem
        className="bg-cover bg-no-repeat h-screen items-center flex  justify-center relative"
        height="100vh"
      >
        {authType !== "complete" ? (
          <Box width={400}>
            {authType === "login" && <SignSection />}
            {authType === "register" && <RegisterSection />}
            {authType === "reset" && <ResetSection />}
            {authType === "verify" && <Verify />}
          </Box>
        ) : (
          <Box width="64%">{authType === "complete" && <LastStep />}</Box>
        )}
      </GridItem>
    </Grid>
  );
}

export default AuthComponent;
