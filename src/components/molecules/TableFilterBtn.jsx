import { useEffect, useMemo, useState } from "react";
import {
  Checkbox,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import interliningIcon from "@/assets/interlining.svg";
import PropTypes from "prop-types";
import { partial } from "lodash";
import SettingIcon from "../atoms/Icons/Setting";

let colIds;
const disabledCheckboxes = ["image", "product_name"];

export default function TableFilterBtn({
  onColumnVisibilityChange,
  onColumnsReorder,
  leafColumns,
}) {
  const [isTouched, setIsTouched] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const derivedCols = useMemo(() => {
    return leafColumns
      .filter(
        (leafColumn) =>
          leafColumn.id !== "select" && leafColumn.id !== "filter",
      )
      .map(({ id, getIsVisible }) => ({
        id,
        getIsVisible,
      }));
  }, [leafColumns]);

  const [cols, setCols] = useState(
    derivedCols.map(({ id, getIsVisible }) => ({
      id,
      isVisible: getIsVisible(),
    })),
  );

  useEffect(() => {
    setCols(
      derivedCols.map(({ id, getIsVisible }) => ({
        id,
        isVisible: getIsVisible(),
      })),
    );
  }, [derivedCols]);

  const toggleHandler = (index, e) => {
    if (!disabledCheckboxes.includes(cols[index].id)) {
      setCols((prev) => {
        const newCols = [...prev];
        newCols[index].isVisible = e.target.checked;
        return newCols;
      });

      if (!isTouched) setIsTouched(true);
    }
  };

  const dragHandler = ({ source, destination }) => {
    if (!destination || !source) return;
    if (destination.index === source.index) return;

    const newCols = [...cols];
    const [removed] = newCols.splice(source.index, 1);
    newCols.splice(destination.index, 0, removed);
    setCols(newCols);

    if (!isTouched) setIsTouched(true);
  };

  const resetHandler = () => {
    setCols(
      derivedCols.map(({ id, getIsVisible }) => ({
        id,
        isVisible: getIsVisible(),
      })),
    );
  };

  const applyHandler = () => {
    cols.forEach(({ id, isVisible }) => {
      const originalColIdx = leafColumns.findIndex((col) => col.id === id);

      if (originalColIdx !== -1) {
        onColumnVisibilityChange(leafColumns[originalColIdx], {
          target: {
            checked: isVisible,
          },
        });
      }
    });

    colIds = ["select"].concat(
      cols.map(({ id }) => id),
      "filter",
    );

    onColumnsReorder(colIds);

    onClose();
  };

  useEffect(() => {
    const hasVisibilityChanged = derivedCols.some(
      ({ id, getIsVisible }) =>
        getIsVisible() !== cols.find((col) => col.id === id)?.isVisible,
    );

    const hasOrderChanged = derivedCols.some(
      ({ id }, index) => id !== cols[index].id,
    );

    const hasChanged = hasVisibilityChanged || hasOrderChanged;

    setIsTouched(hasChanged);
  }, [cols, derivedCols]);

  return (
    <Box w="25px">
      <Flex
        width="30px"
        height="30px"
        bg="colors.sidebar"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        transform="translate(-8px, 0px)"
        cursor="pointer"
      >
        <SettingIcon color="brand.500" onClick={onOpen} />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent rounded="3xl" bg="colors.body">
          <DragDropContext onDragEnd={dragHandler}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <ModalBody ref={provided.innerRef} {...provided.droppableProps}>
                  {cols.map((col, index) => (
                    <Draggable
                      key={col.id}
                      draggableId={`draggable-${col.id}`}
                      index={index}
                    >
                      {(providedDrag) => (
                        <Flex
                          ref={providedDrag.innerRef}
                          {...providedDrag.draggableProps}
                          {...rowStyles}
                          bg="colors.grayF9"
                        >
                          <Checkbox
                            iconColor="#fff"
                            isChecked={
                              !disabledCheckboxes.includes(col.id)
                                ? col.isVisible
                                : true
                            }
                            onChange={partial(toggleHandler, index)}
                          >
                            {t(col.id)}
                          </Checkbox>

                          <Image
                            width="18px"
                            src={interliningIcon}
                            alt="drag"
                            w="25px"
                            h="25px"
                            {...providedDrag.dragHandleProps}
                          />
                        </Flex>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ModalBody>
              )}
            </Droppable>
          </DragDropContext>

          <ModalFooter>
            <Button
              colorScheme="grey"
              w="100%"
              color="tomato"
              mr="1rem"
              height="48px"
              onClick={resetHandler}
              isDisabled={!isTouched}
            >
              {t("reset")}
            </Button>
            <Button
              colorScheme="grey"
              w="100%"
              color="brand.500"
              height="48px"
              onClick={applyHandler}
              isDisabled={!isTouched}
            >
              {t("apply")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

TableFilterBtn.propTypes = {
  onColumnVisibilityChange: PropTypes.func.isRequired,
  onColumnsReorder: PropTypes.func.isRequired,
  leafColumns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      getIsVisible: PropTypes.func,
    }),
  ).isRequired,
};

const rowStyles = {
  justifyContent: "space-between",
  bg: "blackAlpha.50",
  rounded: "xl",
  my: "3",
  py: "2",
  px: "4",
  height: "42px",
};
