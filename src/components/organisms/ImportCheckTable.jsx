/* eslint-disable no-nested-ternary */
import { useCallback, useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
  Text,
  Flex,
  Image,
  Button,
  useOutsideClick,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import useLatestClosure from "@/hooks/useLatestClosure";
import PropTypes from "prop-types";
import successIcon from "@/assets/success-2.svg";
import warningIcon from "@/assets/warning.svg";
import { ACTIONS, checkHeader } from "../templates/ImportCheckTemplate/data";
import TableSkeleton from "../atoms/Skeleton/TableSkeleton";

export default function ImportCheckTable({
  isWorksheetReady,
  headers,
  data,
  dispatchWorksheet,
  setImportProperties,
  importProperties,
  propertyTemplates,
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [popoverIdx, setPopoverIdx] = useState(null);
  const [uiHeaders, setUiHeaders] = useState([]);
  const flagRef = useRef(null);
  const ref = useRef();
  const { t } = useTranslation();

  useOutsideClick({
    ref,
    handler: () => setPopoverIdx(null),
  });

  const getTableActions = useLatestClosure(() => [
    {
      id: "dont-upload",
      label: (
        <Box as="span" fontWeight="500" px="2">
          {t("dont_upload")}
        </Box>
      ),
      onclick: (index) => {
        setImportProperties((prev) => {
          const newProps = [...prev];
          newProps[index] = {
            ...newProps[index],
            is_uploadable: false,
            is_attribute: false,
            is_new: true,
          };

          return newProps;
        });

        setPopoverIdx(null);
      },
    },
    {
      id: "new-prop",
      label: (
        <Box as="span" fontWeight="500" px="2">
          {t("add_a_new_property")}
        </Box>
      ),
      onclick: (index) => {
        const isNewProperty = !propertyTemplates.includes(
          importProperties[index].field_name,
        );

        if (isNewProperty) {
          setImportProperties((prev) => {
            const newProps = [...prev];
            newProps[index] = {
              ...newProps[index],
              is_new: true,
              is_attribute: false,
              is_uploadable: true,
            };

            return newProps;
          });
        }
        setPopoverIdx(null);
      },
    },
    {
      id: "select-prop",
      label: (
        <Box as="span" fontWeight="500" px="2">
          {t("select_a_property")}{" "}
          <ChevronRightIcon fontSize="2xl" color="brand.500" />
        </Box>
      ),
      onclick: () => handleTabChange(1),
    },
  ]);

  const unusedOpts = propertyTemplates?.filter((opt) => {
    const inHeaders = headers.includes(opt);
    const isUploadable = importProperties.find(
      (prop) => prop.field_name === opt,
    )?.is_uploadable;

    return !inHeaders || !isUploadable;
  });

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const selectPropertyHandler = useCallback(
    (property, index) => {
      setImportProperties((prev) => {
        const newProps = [...prev];
        newProps[index] = {
          ...newProps[index],
          field_name: property,
          is_new: false,
          is_attribute: true,
          is_uploadable: true,
        };
        return newProps;
      });

      dispatchWorksheet({
        type: ACTIONS.setColHeader,
        payload: {
          colIdx: index,
          newHeader: property,
        },
      });

      setTabIndex(0);
    },
    [setImportProperties, dispatchWorksheet],
  );

  useEffect(() => {
    if (!flagRef.current && headers.length) {
      setUiHeaders([...headers]);
      flagRef.current = true;
    }
  }, [headers]);

  return isWorksheetReady ? (
    <table>
      <thead>
        <tr>
          {uiHeaders.map((uiHeader, index) => (
            <th key={uiHeader} className="p-4 border-b-[#e2e8f0]">
              <Flex gap="2" alignItems="center">
                {uiHeader}
                {!importProperties[index]?.is_uploadable ? (
                  <SmallCloseIcon
                    color="red.500"
                    role="presentation"
                    boxSize="1.5em"
                  />
                ) : checkHeader(
                    headers[index],
                    importProperties[index],
                    propertyTemplates,
                  ) ? (
                  <Image src={successIcon} alt="correct" />
                ) : (
                  <Image src={warningIcon} alt="warning" />
                )}
              </Flex>
            </th>
          ))}
        </tr>
      </thead>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={header}
              className="border p-0 bg-[#f9f9f9]"
              style={{ borderColor: "var(--ck-colors-colors-sidebarBorder)" }}
            >
              <Popover
                isLazy
                onClose={() => {
                  handleTabChange(0);
                }}
                onOpen={() => setPopoverIdx(index)}
                isOpen={index === popoverIdx}
              >
                <PopoverTrigger>
                  <Button
                    rightIcon={<ChevronDownIcon fontSize="2xl" />}
                    colorScheme="gray"
                    width="100%"
                    borderRadius={0}
                    display="flex"
                    justifyContent="space-between"
                    h="14"
                    bg="colors.heading"
                    _hover={{
                      bg: "colors.sidebarBorder",
                    }}
                  >
                    {checkHeader(
                      header,
                      importProperties[index],
                      propertyTemplates,
                    )
                      ? header
                      : "Select an action"}
                  </Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent w="250px" shadow="xl" bg="colors.sidebar">
                    <PopoverBody p="0" ref={ref}>
                      <SwipeableViews
                        index={tabIndex}
                        onChangeIndex={handleTabChange}
                      >
                        <Flex flexDir="column">
                          {getTableActions().map((action) => (
                            <Text
                              key={action.id}
                              _hover={{ bg: "colors.greyD9" }}
                              cursor="pointer"
                              p="2"
                              onClick={() => action.onclick(index)}
                            >
                              {action.label}
                            </Text>
                          ))}
                        </Flex>
                        <Box height="120px">
                          <Text
                            _hover={{ bg: "gray.100" }}
                            cursor="pointer"
                            p="2"
                            onClick={() => handleTabChange(0)}
                          >
                            <ChevronLeftIcon fontSize="2xl" color="brand.500" />{" "}
                            {t("back")}
                          </Text>
                          {unusedOpts.map((property) => (
                            <Text
                              key={property}
                              _hover={{ bg: "gray.100" }}
                              cursor="pointer"
                              py="2"
                              px="4"
                              onClick={() => {
                                selectPropertyHandler(property, index);
                                setPopoverIdx(null);
                              }}
                            >
                              {property}
                            </Text>
                          ))}
                        </Box>
                      </SwipeableViews>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row}>
            {Object.keys(row).map((key) => (
              <td key={key} className="border p-4">
                <Box fontWeight="500">{row[key]}</Box>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <TableSkeleton isLoaded={isWorksheetReady} />
  );
}

ImportCheckTable.propTypes = {
  isWorksheetReady: PropTypes.bool.isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  dispatchWorksheet: PropTypes.func.isRequired,
  setImportProperties: PropTypes.func.isRequired,
  importProperties: PropTypes.arrayOf(
    PropTypes.shape({
      field_name: PropTypes.string,
      is_uploadable: PropTypes.bool,
      is_attribute: PropTypes.bool,
      is_new: PropTypes.bool,
    }),
  ).isRequired,
  propertyTemplates: PropTypes.arrayOf(PropTypes.string).isRequired,
};
