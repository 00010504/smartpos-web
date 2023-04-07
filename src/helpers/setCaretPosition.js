export default function setCaretPosition(elm, caretPos) {
  if (elm != null) {
    if (elm.createTextRange) {
      var range = elm.createTextRange();
      range.move("character", caretPos);
      range.select();
    } else {
      if (elm.selectionStart) {
        elm.focus();
        elm.setSelectionRange(caretPos, caretPos);
      } else elm.focus();
    }
  }
}
