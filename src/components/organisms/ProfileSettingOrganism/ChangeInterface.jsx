import { useState } from "react";
import { useLangContext } from "@/contexts/langContext";
import { useColorModeContext } from "@/contexts/colorModeContext";
import { useTranslation } from "react-i18next";
import Drawer from "@/components/molecules/Drawer";
import ThemeRadio from "@/components/molecules/ProfileSettingMolecule/ThemeRadio";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

export default function ChangeInterface() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { lang, changeLang } = useLangContext();
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const { setColorMode } = useColorModeContext();

  const [draft, setDraft] = useState({
    language: lang,
    color_mode: colorMode,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (draft.language !== lang) {
      changeLang(draft.language);
    }

    if (draft.color_mode !== colorMode) {
      toggleColorMode();
      setColorMode((prev) => (prev === "light" ? "dark" : "light"));
    }

    onClose();
  };

  const onReset = () => {};

  return (
    <>
      <Button height="50px" bg="colors.grayF9" {...goButton} onClick={onOpen}>
        {t("change_interface")}
      </Button>
      <Drawer
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading>{t("interface")}</Heading>}
        Body={
          <form onSubmit={handleSubmit} id="interface-form">
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel htmlFor="language">{t("language")}</FormLabel>
                <Select
                  size="lg"
                  id="language"
                  onChange={(e) => {
                    setDraft({ ...draft, language: e.target.value });
                  }}
                  value={draft.language}
                >
                  <option value="en">English</option>
                  <option value="ru">{t("russian")}</option>
                </Select>
              </FormControl>
              <ThemeRadio
                label={t("theme")}
                activeValue={draft.color_mode}
                setActiveValue={(newValue) => {
                  setDraft({ ...draft, color_mode: newValue });
                }}
                options={[
                  { value: "light", label: t("light") },
                  { value: "dark", label: t("dark") },
                  { value: "system", label: t("system") },
                ]}
              />
            </VStack>
          </form>
        }
        Footer={
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button {...saveButton} color="red" onClick={onReset}>
              {t("reset")}
            </Button>
            <Button {...saveButton} type="submit" form="interface-form">
              {t("apply")}
            </Button>
          </Box>
        }
      />
    </>
  );
}

const goButton = {
  color: "brand.500",
  colorScheme: "gray",
  fontSize: "lg",
  w: "xs",
  size: "lg",
};
const saveButton = {
  w: "48%",
  colorScheme: "gray",
  color: "brand.500",
};
