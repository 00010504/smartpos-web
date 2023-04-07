import { useReducer, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { motion } from "framer-motion";
import { List, Box, Image } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LocalStorage from "@/utils/LocalStorage";
import keydown from "@/events/keydown";
import beforeunload from "@/events/beforeunload";
import toggleSidebar from "@/helpers/toggleSidebar";
import useLatestClosure from "@/hooks/useLatestClosure";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@/assets/ExpandMore.svg";
import ExpandMoreIcon2 from "@/assets/ExpandMore2.svg";
import {
  reducer,
  VARIANTS,
  ACTIONS,
  getItemStyle,
  initialize,
  toLocalStorage,
  findParentIndex,
} from "./data";
import BrandLogoRow from "./BrandLogoRow";
import SidebarItem from "./SidebarItem";

export default function Sidebar({ items }) {
  const {
    params: { subpath },
  } = useMatch("/:mainpath/:subpath/*") ?? {
    params: { mainpath: null, subpath: null },
  };

  const [sidebarItems, dispatchItems] = useReducer(reducer, initialize(items));
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    LocalStorage?.sidebar?.isOpen ?? true,
  );

  const onMenuCollapse = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const onItemClick = (index) => {
    dispatchItems({ type: ACTIONS.click, payload: { index } });
  };

  const onDragEnd = ({ source, destination }) => {
    dispatchItems({ type: ACTIONS.reorder, payload: { source, destination } });
  };

  const onClose = useLatestClosure(() => {
    LocalStorage.set("sidebar", {
      isOpen: isSidebarOpen,
      items: toLocalStorage(sidebarItems),
    });
  });

  useEffect(() => {
    beforeunload.register(onClose);

    return () => beforeunload.unregister();
  }, [onClose]);

  useEffect(() => {
    keydown.register(toggleSidebar(onMenuCollapse));

    return () => keydown.unregister();
  }, []);

  useEffect(() => {
    if (isSidebarOpen && subpath) {
      const index = findParentIndex(subpath, sidebarItems);
      dispatchItems({ type: ACTIONS.activate, payload: { index } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen, subpath]);

  return (
    <motion.div
      animate={isSidebarOpen ? "open" : "closed"}
      initial={{ width: isSidebarOpen ? "240px" : "65px" }} // flexBasis instead of width
      variants={VARIANTS}
      style={{
        flexShrink: "0",
        position: "relative",
      }}
      transition={{
        spring: {
          damping: 30,
          stiffness: 500,
        },
        duration: 0.2,
      }}
    >
      <Box
        pos="absolute"
        top="50px"
        right="-15px"
        zIndex="sticky"
        display={isSidebarOpen ? "none" : "block"}
      >
        <Box mr="6px" pos="relative" cursor="pointer" onClick={onMenuCollapse}>
          <Image
            src={ExpandMoreIcon}
            alt="expand more"
            w="25px"
            style={{
              rotate: isSidebarOpen ? "0deg" : "180deg",
            }}
          />
          <Image
            src={ExpandMoreIcon2}
            alt="expand more"
            w="25px"
            pos="absolute"
            right="-8px"
            top="0"
            style={{
              rotate: isSidebarOpen ? "0deg" : "180deg",
            }}
          />
        </Box>
      </Box>

      <List
        fontWeight="500"
        height="100vh"
        overflowY="auto"
        bg="colors.sidebar"
        role={isSidebarOpen ? "navigation" : "none"}
      >
        <BrandLogoRow
          isSidebarOpen={isSidebarOpen}
          onMenuCollapse={onMenuCollapse}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                mb={4}
                // style={getListStyle(snapshot.isDraggingOver)}
              >
                {sidebarItems.map(({ id, title, path, Icon, children }, i) => (
                  <Draggable key={id} draggableId={id} index={i}>
                    {(dragProvided, dragSnapshot) => (
                      <Box
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={getItemStyle(
                          dragSnapshot.isDragging,
                          dragProvided.draggableProps.style,
                        )}
                      >
                        <SidebarItem
                          Icon={Icon}
                          title={title}
                          isClicked={
                            sidebarItems.length && sidebarItems[i]?.isActive
                          }
                          isDragging={dragSnapshot.isDragging}
                          onClick={() => onItemClick(i)}
                          isSidebarOpen={isSidebarOpen}
                          path={path}
                          subpath={subpath}
                        >
                          {children}
                        </SidebarItem>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </motion.div>
  );
}

Sidebar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
