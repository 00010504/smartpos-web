import { Box, Button, Text, VisuallyHidden } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import { buttonStyles } from "./data";

function OptionsCreateProduct() {
  const { t } = useTranslation();

  return (
    <Box pos="relative">
      <VisuallyHidden id="options" height="150px" pos="absolute" top="-72px" />
      <Box pt={12}>
        <SectionHeader title={t("options")} />
        <Text>
          Add a custom set of options to an item to create variations. For
          example, a size option set can create variations small, medium, and
          large.{" "}
          <a style={{ color: "#256DF6", marginLeft: "2px" }} href="$">
            Learn more
          </a>
        </Text>
        <Button colorScheme="gray" type="button" {...buttonStyles}>
          Add options
        </Button>
      </Box>
    </Box>
  );
}

export default OptionsCreateProduct;
