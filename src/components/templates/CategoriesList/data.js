export const tableStyles = {
  td: {
    color: "colors.text",
    fontSize: "18px",
    borderBottom: "none",
    p: "25px 20px",
  },
  th: {
    border: "none",
    textTransform: "none",
    fontWeight: "500",
    padding: "20px 20px",
    color: "grey.800",
    fontSize: "16px",
    _first: {
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px",
    },
    _last: {
      borderTopRightRadius: "10px",
      borderBottomRightRadius: "10px",
    },
  },
  thead: {
    borderRadius: "10px",
    backgroundColor: "colors.grayF9",
  },
};

export const styles = {
  container: {
    marginTop: "-25px",
    marginBottom: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputStyles: {
    margin: "10px auto",
    marginTop: "20px",
    padding: "24px 18px",
    borderRadius: "10px",
    fontWeight: "500",
    border: "1px solid #D9D9D9",
    color: "#000",
    minWidth: "350px",
    width: "480px",
  },
  tableTop: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  createButton: {
    height: "45px",
    width: "100px",
    borderRadius: "10px",
    color: "#fff",
  },
};

export const emptyState = {
  name: "",
  children: [],
  draft: "",
};

export const createStyles = {
  input: {
    bg: "colors.grayF9",
    padding: "0 24px",
    fontSize: "16px",
    height: "50px",
    border: "none",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    _placeholder: {
      color: "#BDBDBD !important",
    },
  },
  buttonStyles: {
    mt: 6,
    colorScheme: "gray",
    color: "#256DF6",
    height: "54px",
    width: "100%",
    borderRadius: 10,
  },
  rightElement: {
    position: "absolute",
    right: "24px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 4,
  },
};

export const reducer = (state, action) => {
  const { ...copiedState } = state;

  switch (action.type) {
    case "top": {
      copiedState.name = action.payload;
      copiedState.draft = "";
      return copiedState;
    }
    case "draft": {
      copiedState.draft = action.payload;
      return copiedState;
    }
    case "changeValue": {
      copiedState.children[action.payload.id].name = action.payload.value;
      return copiedState;
    }
    case "child": {
      const preChilds = copiedState.children || [];
      copiedState.draft = "";
      copiedState.children = [
        ...preChilds,
        {
          name: action.payload,
        },
      ];

      return copiedState;
    }
    case "delete": {
      copiedState.children = state.children.filter(
        (_, index) => index !== action.payload,
      );
      return copiedState;
    }
    case "clear": {
      return emptyState;
    }
    default:
      return state;
  }
};
