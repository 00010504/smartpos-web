/* eslint-disable no-shadow */
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./style.css";

export default function Resizable({ child }) {
  const ref = useRef(null);
  const refLeft = useRef(null);
  const refTop = useRef(null);
  const refRight = useRef(null);
  const refBottom = useRef(null);

  useEffect(() => {
    const resizableEl = ref.current;
    const styles = window.getComputedStyle(resizableEl);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 0;
    let y = 0;
    resizableEl.style.top = "0";
    resizableEl.style.left = "0";
    // top resize
    const onMouseMoveTopResize = (event) => {
      const dy = event.clientY - y;
      height -= dy;
      y = event.clientY;
      resizableEl.style.height = `${height}px`;
    };
    const onMouseUpTopResize = () => {
      document.removeEventListener("mousemove", onMouseMoveTopResize);
    };
    const onMouseDownTopResize = (event) => {
      event.stopPropagation();
      y = event.clientY;
      const styles = window.getComputedStyle(resizableEl);
      resizableEl.style.bottom = styles.bottom;
      resizableEl.style.top = null;
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
    };
    // right resize
    const onMouseMoveRightResize = (event) => {
      const dx = event.clientX - x;
      width += dx;
      x = event.clientX;
      resizableEl.style.width = `${width}px`;
    };
    const onMouseUpRightResize = () => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
    };
    const onMouseDownRightResize = (event) => {
      event.stopPropagation();
      x = event.clientX;
      resizableEl.style.left = styles.left;
      resizableEl.style.right = null;
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
    };
    // bottom resize
    const onMouseMoveBottomResize = (event) => {
      const dy = event.clientY - y;
      height += dy;
      y = event.clientY;
      resizableEl.style.height = `${height}px`;
    };
    const onMouseUpBottomResize = () => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
    };
    const onMouseDownBottomResize = (event) => {
      event.stopPropagation();
      y = event.clientY;
      const styles = window.getComputedStyle(resizableEl);
      resizableEl.style.top = styles.top;
      resizableEl.style.bottom = null;
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
    };
    // left resize
    const onMouseMoveLeftResize = (event) => {
      const dx = event.clientX - x;
      width -= dx;
      x = event.clientX;
      resizableEl.style.width = `${width}px`;
    };
    const onMouseUpLeftResize = () => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
    };
    const onMouseDownLeftResize = (event) => {
      event.stopPropagation();
      x = event.clientX;
      resizableEl.style.right = styles.right;
      resizableEl.style.left = null;
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
    };
    // mouse down event listener
    const resizerRight = refRight.current;
    resizerRight.addEventListener("mousedown", onMouseDownRightResize);

    const resizerTop = refTop.current;
    resizerTop.addEventListener("mousedown", onMouseDownTopResize);

    const resizerBottom = refBottom.current;
    resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);

    const resizerLeft = refLeft.current;
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    return () => {
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
    };
  }, []);

  return (
    <div className="container">
      <div ref={ref} className="resizable">
        {child}
        <div ref={refLeft} className="resizer resizer-l" />
        <div ref={refTop} className="resizer resizer-t" />
        <div ref={refRight} className="resizer resizer-r" />
        <div ref={refBottom} className="resizer resizer-b" />
      </div>
    </div>
  );
}

Resizable.propTypes = {
  child: PropTypes.node.isRequired,
};
