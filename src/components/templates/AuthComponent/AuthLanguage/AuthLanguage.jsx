import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  ListItem,
  UnorderedList,
  Button,
} from "@chakra-ui/react";
import settings from "@/config/settings";
import { useLangContext } from "@/contexts/langContext";

function AuthLanguage() {
  const { changeLang, lang } = useLangContext();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOpen={open}
    >
      <PopoverTrigger>
        <Button {...textStyles} aria-label="language">
          {settings.languages.find((language) => language.code === lang).name}
        </Button>
      </PopoverTrigger>
      {open && (
        <PopoverContent {...popoverStyles}>
          <PopoverBody>
            <UnorderedList>
              {settings.languages.map((language) => (
                <ListItem
                  {...listItemStyles}
                  key={language.code}
                  onClick={() => {
                    changeLang(language.code);
                    setOpen(false);
                  }}
                >
                  {language.name}
                </ListItem>
              ))}
            </UnorderedList>
          </PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
}

export default AuthLanguage;

const textStyles = {
  position: "absolute",
  bottom: "40px",
  left: "60px",
  fontWeight: "500",
  color: "#fff",
  cursor: "pointer",
  variant: "ghost",
};
const popoverStyles = {
  paddingLeft: "5px",
  width: "120px",
  background: "rgba( 255, 255, 255, 0.2)",
  backdropFilter: "blur(6px)",
  borderRadius: "10px",
  boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.32) !important",
  border: "none",
};
const listItemStyles = {
  color: "whiteAlpha.900",
  marginBottom: "4px",
  cursor: "pointer",
};
