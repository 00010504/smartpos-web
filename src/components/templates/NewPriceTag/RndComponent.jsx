import { Rnd } from "react-rnd";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

function RND({
  element,
  position,
  width,
  height,
  onChangeResize,
  onChangePosition,
  selectedItem,
  fieldName,
}) {
  // useOutsideClick({
  //   ref,
  //   handler: () => selectedItem.onChange(null),
  // });

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width,
        height,
      }}
      bounds="parent"
      onResize={(e, direction, r) => {
        onChangeResize({
          width: +r.offsetWidth,
          height: +r.offsetHeight,
        });
      }}
      onDragStop={(e, d) => {
        onChangePosition({
          x: d.x,
          y: d.y,
        });
      }}
      disableDragging={
        !selectedItem?.value || fieldName !== selectedItem?.value.field_name
      }
      enableResizing={
        selectedItem?.value && fieldName === selectedItem?.value.field_name
      }
    >
      {selectedItem.value?.field_name === fieldName && (
        <Box
          position="absolute"
          width={`${width + 12}px`}
          height={`${height + 12}px`}
          top="-6px"
          left="-6px"
          border="2px solid #4993DD"
          zIndex={-1}
        >
          <Box top="-6px" left="-6px" {...css.resizeBtn} cursor="nwse-resize" />
          <Box top="-6px" right="-6px" {...css.resizeBtn} />
          <Box bottom="-6px" left="-6px" {...css.resizeBtn} />
          <Box bottom="-6px" right="-6px" {...css.resizeBtn} />
        </Box>
      )}
      <Box overflow="hidden" width={`${width}px`} height={`${height}px`}>
        {element}
      </Box>
    </Rnd>
  );
}

export default RND;

RND.propTypes = {
  element: PropTypes.node.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onChangeResize: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    value: PropTypes.shape({
      field_name: PropTypes.string,
    }),
    onChange: PropTypes.func,
  }).isRequired,
  onChangePosition: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
};

const css = {
  resizeBtn: {
    position: "absolute",
    width: "10px",
    height: "10px",
    bg: "#fff",
    border: "2px solid #4993DD",
    zIndex: 1,
  },
};
