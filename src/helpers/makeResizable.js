import { uid } from "radash";
import getStyleVal from "./getStyleVal";

let isActive = {};
var pageX, curCol, nxtCol, curColWidth, nxtColWidth;
var hooks;

export default function makeResizable(container, cols, extraHooks) {
  hooks = extraHooks;
  container.style.overflow = "hidden";

  var tableHeight = container.offsetHeight;

  for (var i = 0; i < cols.length - 1; i++) {
    // var div = createDiv(tableHeight);
    var div = createDiv(56); // assuming this module is only used for products table
    cols[i].appendChild(div);
    cols[i].style.position = "relative";
    setListeners(div);
  }

  return function removeListeners() {
    for (var i = 0; i < cols.length - 1; i++) {
      var div = cols[i].lastElementChild;
      div.removeEventListener("mousedown", mouseDown);
      div.removeEventListener("mouseover", mouseOver);
      div.removeEventListener("mouseout", mouseOut);
    }

    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  };
}

function setListeners(div) {
  div.addEventListener("mousedown", mouseDown);

  div.addEventListener("mouseover", mouseOver);

  div.addEventListener("mouseout", mouseOut);

  document.addEventListener("mousemove", mouseMove);

  document.addEventListener("mouseup", mouseUp);
}

function mouseOver(e) {
  if (typeof hooks?.onMouseOver === "function") {
    hooks.onMouseOver(e);
  }

  e.target.style.backgroundColor = "#90C2E7";
}

function mouseDown(e) {
  if (typeof hooks?.onMouseDown === "function") {
    hooks.onMouseDown(e);
  }

  if (e.target.id) {
    isActive[e.target.id] = true;
  }

  curCol = e.target.parentElement;
  nxtCol = curCol.nextElementSibling;
  pageX = e.pageX;

  var padding = paddingDiff(curCol);

  curColWidth = curCol.offsetWidth - padding;
  if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
}

function mouseMove(e) {
  if (typeof hooks?.onMouseMove === "function") {
    hooks.onMouseMove(e);
  }

  if (curCol) {
    var diffX = e.pageX - pageX;

    if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

    curCol.style.width = curColWidth + diffX + "px";
  }
}

function mouseUp(e) {
  if (typeof hooks?.onMouseUp === "function") {
    hooks.onMouseUp(e);
  }

  // that means we are outside the container or cursor was moved from created div
  if (!e.target.id) {
    var activeElmId = Object.keys(isActive).find((key) => !!isActive[key]);
    var activeElm = document.getElementById(activeElmId);

    if (activeElm) {
      activeElm.style.backgroundColor = "transparent";
    }
  }

  Object.keys(isActive).forEach((key) => {
    isActive[key] = false;
  });

  curCol = undefined;
  nxtCol = undefined;
  pageX = undefined;
  nxtColWidth = undefined;
  curColWidth = undefined;
}

function mouseOut(e) {
  if (typeof hooks?.onMouseOut === "function") {
    hooks.onMouseOut(e);
  }

  if (!isActive[e.target.id]) {
    e.target.style.backgroundColor = "transparent";
  }
}

function paddingDiff(col) {
  if (getStyleVal(col, "box-sizing") == "border-box") {
    return 0;
  }
  var padLeft = getStyleVal(col, "padding-left");
  var padRight = getStyleVal(col, "padding-right");
  return parseInt(padLeft) + parseInt(padRight);
}

function createDiv(height) {
  var div = document.createElement("div");
  var id = uid(5);

  isActive[id] = false;

  div.id = id;
  div.style.top = 0;
  div.style.right = 0;
  div.style.width = "5px";
  div.style.position = "absolute";
  div.style.cursor = "col-resize";
  div.style.userSelect = "none";
  div.style.height = height + "px";

  return div;
}
