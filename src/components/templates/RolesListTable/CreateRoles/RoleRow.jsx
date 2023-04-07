import {
  Box,
  Checkbox,
  Flex,
  SimpleGrid,
  Switch,
  Text,
  VisuallyHidden,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useLangContext } from "@/contexts/langContext";
import { ACTIONS } from "./data";

function RoleRow({ module, dispatchModules }) {
  const { lang } = useLangContext();

  // SINGLE PERMISSION ON_CHANGE FUNCTION 🧨
  const handlePermissionChange = (e, id) => {
    dispatchModules({
      type: ACTIONS.changePermission,
      payload: {
        module_id: module.name,
        section_id: id,
        permission_id: e.target.id,
        is_added: e.target.checked,
      },
    });
  };

  // SINGLE SECTION ON_CHANGE FUNCTION 🧨
  const handleSection = (e, id) => {
    dispatchModules({
      type: ACTIONS.changeSection,
      payload: {
        module_id: module.name,
        section_id: id,
        is_added: e.target.checked,
      },
    });
  };

  // WHOLE MODULE ON_CHANGE FUNCTION 🧨
  const handleModule = (e) => {
    dispatchModules({
      type: ACTIONS.changeModule,
      payload: {
        module_id: module.name,
        is_added: e.target.checked,
      },
    });
  };

  return (
    <Box mt="50px" position="relative">
      <VisuallyHidden
        height="150px"
        pos="absolute"
        top="-110px"
        id={module.name.toLowerCase().replace(" ", "-")}
      />
      <SimpleGrid {...styles.container}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text {...styles.title}>{module.name_translation[lang]}</Text>
          <Switch
            name={module.name}
            size="lg"
            sx={{
              "span.chakra-switch__track[data-checked]": {
                backgroundColor: "brand.500",
              },
            }}
            isChecked={module.sections?.every((section) => section.is_added)}
            onChange={handleModule}
          />
        </Flex>
        {module.sections.length > 0 && (
          <SimpleGrid
            p="16px"
            gap="20px"
            borderRadius="10px"
            bg="colors.grayF9"
          >
            {module?.sections?.map((section) => (
              <Accordion
                allowToggle
                bg="colors.sidebar"
                borderRadius="10px"
                key={section.name}
              >
                <AccordionItem border="none" outline="none !important">
                  <AccordionButton
                    justifyContent="space-between"
                    borderRadius="10px"
                  >
                    <Flex alignItems="center" gap="20px">
                      <Checkbox
                        isIndeterminate={
                          !section.permissions?.every(
                            (permission) => permission.is_added,
                          ) &&
                          section.permissions?.some(
                            (permission) => permission.is_added,
                          )
                        }
                        isChecked={
                          section.permissions.length &&
                          section.permissions?.every(
                            (permission) => permission.is_added,
                          )
                        }
                        onChange={(e) => handleSection(e, section.id)}
                        isDisabled={!section.permissions}
                      />
                      <Text pt={1}>{section.name_translation[lang]}</Text>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  {section?.permissions && (
                    <AccordionPanel pb={4}>
                      <Box pl="38px">
                        {section?.permissions?.map((permission) => (
                          <Flex
                            alignItems="center"
                            key={permission.id}
                            gap="20px"
                          >
                            <Checkbox
                              name={permission.id}
                              value={permission.id}
                              isChecked={permission.is_added}
                              id={permission.id}
                              onChange={(e) =>
                                handlePermissionChange(e, section.id)
                              }
                            />
                            <Text pt={1}>
                              {permission.name_translation[lang]}
                            </Text>
                          </Flex>
                        ))}
                      </Box>
                    </AccordionPanel>
                  )}
                </AccordionItem>
              </Accordion>
            ))}
          </SimpleGrid>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default RoleRow;

RoleRow.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    is_added: PropTypes.bool,
    name_translation: PropTypes.shape({
      en: PropTypes.string,
      ar: PropTypes.string,
    }),
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }).isRequired,
  dispatchModules: PropTypes.func.isRequired,
};

const styles = {
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "color.headingColor",
  },
  container: {
    gap: "20px",
    _first: {
      pt: 0,
    },
  },
};
