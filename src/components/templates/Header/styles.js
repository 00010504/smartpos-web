const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: "0",
    zIndex: "120",
    px: "36px",
    py: "10px",
    pt: "6px",
    bg: "colors.header",
  },
  icon: {
    width: "25px",
    cursor: "pointer",
  },
  icon_wrapper: {
    position: "relative",
  },
  icon_badge: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    fontSize: "10px",
    borderRadius: "50%",
    color: "#fff",
    width: "17px",
    height: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pt: "2px",
  },
  search_input_wrapper: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  search_input: {
    height: "50px",
    border: "none",
    fontSize: "18px",
    pt: "2px",
    _placeholder: {
      color: "colors.placeholder !important",
    },
    _focus: {
      boxShadow: "none",
    },
  },
};

export default styles;
