export default function getStyleVal(elm, css) {
  return window.getComputedStyle(elm, null).getPropertyValue(css);
}
