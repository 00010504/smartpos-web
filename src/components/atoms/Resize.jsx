import { Rnd } from "react-rnd";
import PropTypes from "prop-types";

function Resize({ child, defaultSizes, onChange, onChangePosition, maxSize }) {
  return (
    <Rnd
      style={{
        border: "1px solid rgba(0,0,0,0.2)",
        padding: "3px",
      }}
      default={{ ...defaultSizes }}
      maxWidth={maxSize.width}
      maxHeight={maxSize.height}
      bounds=".parentDiv"
      position={{
        x: defaultSizes.x,
        y: defaultSizes.y,
      }}
      onResizeStop={(e, direction, r) => {
        console.log(e);
        onChange({
          right: r.clientWidth,
          bottom: r.clientHeight,
        });
      }}
      onDragStop={(e, d) => {
        onChangePosition({
          top: d.y,
          left: d.x,
        });
      }}
    >
      {child}
    </Rnd>
  );
}

export default Resize;

Resize.propTypes = {
  child: PropTypes.node.isRequired,
  defaultSizes: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onChangePosition: PropTypes.func.isRequired,
  maxSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};
