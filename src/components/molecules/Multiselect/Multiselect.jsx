import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  useOutsideClick,
} from "@chakra-ui/react";

function Multiselect({ label, options, onChange, value }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const { t } = useTranslation();

  const searchedOptions = useMemo(() => {
    return options
      .map((option) => {
        const filteredOptions = option.options.filter((subOption) =>
          subOption.label.toLowerCase().includes(search.toLowerCase()),
        );
        return {
          label: option.label,
          options: filteredOptions,
        };
      })
      .filter((option) => option.options.length > 0);
  }, [options, search]);

  useOutsideClick({
    ref,
    handler: () => {
      setOpen(false);
      setSearch("");
    },
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  return (
    <FormControl ref={ref}>
      {label && <FormLabel mb="10px">{t(label)}</FormLabel>}
      <Popover
        onClose={() => {
          setOpen(false);
          setSearch("");
        }}
        isOpen={open || search}
        {...css.popover}
      >
        <PopoverTrigger>
          <InputGroup>
            <Input
              placeholder={t("select")}
              onClick={() => setOpen(!open)}
              onChange={(e) => setSearch(e.target.value)}
              value={value?.label}
              autoComplete="off"
              {...css.input}
            />
            <InputRightAddon {...css.rightAddon}>
              <ChevronDownIcon {...css.dropdownIcon} />
            </InputRightAddon>
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent {...css.content}>
          {searchedOptions.length === 0 && (
            <Box {...css.accordionButton}>{t("nothing_found")}</Box>
          )}
          <Accordion {...css.accordion}>
            {searchedOptions.map((option, i) => (
              <AccordionItem border="none" key={option.label}>
                <AccordionButton
                  {...css.accordionButton}
                  borderBottom={i !== options.length - 1 ? "1px solid" : "none"}
                >
                  <Box {...css.buttonLabel}>{option.label}</Box>
                  <AccordionIcon color="colors.icon" />
                </AccordionButton>
                <AccordionPanel p="2px 18px" maxHeight="250px" overflow="auto">
                  <SimpleGrid>
                    {option.options.map((subOption) => (
                      <Box
                        key={subOption.value}
                        onClick={() => {
                          onChange(subOption);
                          setOpen(false);
                        }}
                        {...css.subCategory}
                        color={
                          value?.value === subOption.value ? "#256DF6" : ""
                        }
                        fontWeight={
                          value?.value === subOption.value ? "700" : "500"
                        }
                      >
                        - {subOption.label}
                        {value?.value === subOption.value && (
                          <Box ml="10px" mt="1px" as="span">
                            ✅
                          </Box>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </PopoverContent>
      </Popover>
    </FormControl>
  );
}

export default Multiselect;

const css = {
  popover: {
    autoFocus: false,
    matchWidth: true,
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px !important",
    fontWeight: "500",
    fontSize: "15px",
    height: "50px",
    overflow: "hidden",
  },
  rightAddon: {
    position: "absolute",
    right: -1,
    top: "50%",
    transform: "translateY(-50%)",
    bg: "none",
    border: "none",
  },
  dropdownIcon: {
    mt: "2px",
    width: "25px",
    fontSize: "22px",
    color: "colors.icon",
  },
  content: {
    top: "5px",
    width: "100.2%",
    bg: "var(--ck-colors-colors-heading)",
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 18px 50px -10px",
    borderRadius: "10px",
    fontSize: "14px",
  },
  accordion: {
    allowToggle: true,
    borderRadius: "8px",
    overflow: "hidden",
  },
  accordionButton: {
    border: "none !important",
    p: "10px 16px",
    borderColor: "colors.sidebarBorder",
    textAlign: "left",
  },
  buttonLabel: {
    as: "span",
    flex: "1",
    color: "colors.link",
    fontWeight: 600,
  },
  subCategory: {
    as: "span",
    p: "5px",
    flex: "1",
    textAlign: "left",
    cursor: "pointer",
    transition: "0.15s all ease-in-out",
    _hover: { color: "#256DF6" },
    fontWeight: 500,
  },
};

Multiselect.defaultProps = {
  label: "",
  options: [],
  value: {
    value: "",
    label: "",
  },
};

Multiselect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  //   value: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       value: PropTypes.string,
  //       label: PropTypes.string,
  //     }),
  //   ),
};
