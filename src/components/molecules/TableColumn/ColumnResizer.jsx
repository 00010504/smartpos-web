/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import makeResizable from "@/helpers/makeResizable";
import PropTypes from "prop-types";

export default function ColumnResizer({
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onMouseOver,
  onMouseOut,
}) {
  useEffect(() => {
    // relying on parent container having the same id and columns having the same class
    const container = document.getElementById("container");
    const cols = document.getElementsByClassName("col");

    const hooks = {
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onMouseOver,
      onMouseOut,
    };

    const removeListeners = makeResizable(container, cols, hooks);

    return removeListeners;
  }, []);

  return null;
}

ColumnResizer.defaultProps = {
  onMouseDown: null,
  onMouseUp: null,
  onMouseMove: null,
  onMouseOver: null,
  onMouseOut: null,
};

ColumnResizer.propTypes = {
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
};
