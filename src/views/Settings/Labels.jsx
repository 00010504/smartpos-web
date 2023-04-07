import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import LabelsTemplate from "@/components/templates/Labels/Labels";

function PricingTags() {
  const navigate = useNavigate();
  const match = useMatch("/settings/labels/create");
  const match2 = useMatch("/settings/labels/edit/:label_id");
  const { t } = useTranslation();

  if (match || match2) {
    return <Outlet />;
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <Box>
          <Heading fontWeight="600" fontSize="28px">
            {t("labels")}
          </Heading>
          <Breadcrumb
            options={[
              { href: "/", name: t("dashboard") },
              { name: t("settings") },
              { name: t("labels") },
            ]}
          />
        </Box>
        <Button
          w="100px"
          height="45px"
          mt="12px"
          onClick={() => navigate("/settings/labels/create")}
          color="#fff"
          pt="2px"
        >
          {t("create")}
        </Button>
      </Flex>
      <LabelsTemplate />
    </>
  );
}

export default PricingTags;
