import { Box, Checkbox, Flex, Switch, Text } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { useLangContext } from "@/contexts/langContext";
import { bCSS, commonCSS } from "./data";

function Blocks({
  state,
  onCheckBlock,
  onCheckField,
  onRepositionField,
  onAllCheckboxToogle,
}) {
  const { lang } = useLangContext();

  return (
    <Box {...commonCSS.wrapper}>
      {state.blocks?.map((block) => (
        <Box key={block.id} mb="20px">
          <Flex justifyContent="space-between" alignItems="center">
            <Text {...bCSS.blockHeading}>{block.name_translation[lang]}</Text>
            <Switch
              name={block.id}
              size="md"
              isChecked={block.fields?.some((f) => f.is_added) || false}
              onChange={(e) => {
                onCheckBlock(block.id);
                onAllCheckboxToogle(block.id, e.target.checked);
              }}
              sx={{
                "span.chakra-switch__track[data-checked]": {
                  backgroundColor: "brand.500",
                },
              }}
            />
          </Flex>
          <DragDropContext onDragEnd={onRepositionField}>
            <Droppable droppableId="fields">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  my={6}
                  mt={4}
                >
                  {block.fields?.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={`${block.id}*${field.id}`}
                      index={index}
                    >
                      {(providedDrag) => (
                        <Flex
                          key={field.id}
                          bg="colors.grayF9"
                          p="8px 12px"
                          borderRadius="8px"
                          alignItems="center"
                          justifyContent="space-between"
                          mb="10px"
                          ref={providedDrag.innerRef}
                          {...providedDrag.draggableProps}
                        >
                          <Checkbox
                            isDisabled={!block.fields?.some((f) => f.is_added)}
                            isChecked={field.is_added}
                            iconColor="#fff"
                            onChange={() => onCheckField(block.id, field.id)}
                          >
                            <Text pl="3px" pt="2px">
                              {field.name_translation[lang]}
                            </Text>
                          </Checkbox>
                          <Flex
                            flexDirection="column"
                            gap="4px"
                            {...providedDrag.dragHandleProps}
                          >
                            {Array.from({ length: 3 }).map((_, i) => (
                              <hr
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                style={{
                                  width: "20px",
                                  height: "1px",
                                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                                }}
                              />
                            ))}
                          </Flex>
                        </Flex>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      ))}
    </Box>
  );
}

export default Blocks;

Blocks.propTypes = {
  state: PropTypes.shape({
    blocks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  onCheckBlock: PropTypes.func.isRequired,
  onCheckField: PropTypes.func.isRequired,
  onRepositionField: PropTypes.func.isRequired,
  onAllCheckboxToogle: PropTypes.func.isRequired,
};
