const removePhoneChars = (event) => {
  return event.target.value.replace(/[^\d]/g, "");
};

export default removePhoneChars;
