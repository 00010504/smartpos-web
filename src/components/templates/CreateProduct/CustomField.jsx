import { Box, Button, VisuallyHidden } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import { buttonStyles } from "./data";

function CustomFieldsCreateProduct() {
  const { t } = useTranslation();
  return (
    <Box pos="relative">
      <VisuallyHidden
        id="custom_fields"
        height="150px"
        pos="absolute"
        top="-72px"
      />
      <Box pt={12}>
        <SectionHeader title={t("custom_fields")} />
        <Button
          colorScheme="gray"
          type="button"
          {...buttonStyles}
          marginTop="10px"
        >
          Add custom field
        </Button>
      </Box>
    </Box>
  );
}

export default CustomFieldsCreateProduct;
