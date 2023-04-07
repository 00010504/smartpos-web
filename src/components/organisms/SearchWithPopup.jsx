import { useRef, useState } from "react";
import {
  Box,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Search from "../molecules/Input/Search";
import SearchList from "../molecules/SearchList";

export default function SearchWithPopup({
  containerProps,
  inputProps,
  inputContainerProps,
  placeholder,
  onChange,
  searchResult,
  searchRef,
  register,
  clearSearch,
}) {
  const ref = useRef();
  const { isOpen: isPopoverOpen, onClose, onOpen } = useDisclosure();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { t } = useTranslation();

  useOutsideClick({
    ref,
    handler: () => {
      onClose();
      setIsInputFocused(false);
    },
    enabled: isPopoverOpen || isInputFocused,
  });

  const onSearch = (val) => {
    if (!val) {
      onClose();
    } else {
      onOpen();
    }
    onChange(val);
  };

  return (
    <>
      {isInputFocused && (
        <motion.div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInputFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <Box ref={ref} {...containerProps}>
        <Popover
          autoFocus={false}
          returnFocusOnClose={false}
          isOpen={isPopoverOpen}
          onClose={onClose}
          closeOnBlur={false}
          matchWidth
        >
          <PopoverTrigger>
            <Search
              ref={searchRef}
              inputProps={inputProps}
              containerProps={inputContainerProps}
              placeholder={placeholder}
              onBlur={() => {
                register();
              }}
              onFocus={() => {
                setIsInputFocused(true);
                if (searchRef.current.value) {
                  onOpen();
                }
              }}
              placeholderProps={{
                fontWeight: "600 !important",
                color: "rgba(0,0,0,0.2) !important",
              }}
              inputRightElement={
                <Flex
                  color="#BDBDBD"
                  fontWeight={600}
                  gap="10px"
                  alignItems="center"
                  cursor="pointer"
                  mt={1}
                >
                  {t("click")}{" "}
                  <Text
                    as="span"
                    mt="-2px"
                    width="20px"
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding="2px"
                    fontSize="15px"
                    border="1px solid #BDBDBD"
                    borderRadius="5px"
                    pt="3px"
                  >
                    F
                  </Text>
                </Flex>
              }
              search={{
                onChange: onSearch,
              }}
            />
          </PopoverTrigger>
          <PopoverContent
            top={2}
            // input width + 2 icons width + hstack spacing
            w="calc(100% + 116px + 32px)"
            border="none"
            borderRadius="10px"
            bg="transparent"
            maxH="520px"
            overflow="auto"
          >
            <PopoverBody p={0}>
              <SearchList
                items={searchResult}
                onItemClick={() => {
                  onClose();
                  setIsInputFocused(false);
                }}
                searchWord={searchRef.current?.value}
                clearSearch={clearSearch}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </>
  );
}

SearchWithPopup.defaultProps = {
  containerProps: {},
  inputProps: {},
  inputContainerProps: {},
  placeholder: "",
  onChange: null,
  searchResult: [],
  searchRef: null,
};

SearchWithPopup.propTypes = {
  containerProps: PropTypes.shape({}),
  inputProps: PropTypes.shape({}),
  inputContainerProps: PropTypes.shape({}),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  searchResult: PropTypes.arrayOf(PropTypes.shape({})),
  searchRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  register: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
};
