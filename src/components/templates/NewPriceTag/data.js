export const initialState = {
  layers: [],
  parameters: {
    name: "",
    width: 320,
    height: 180,
  },
  content: {
    // [layers[0].value]: {
    //  field_name: ""
    //  type: "", // text, barcode, image
    //  is_custom_field: false,
    //  product_image: false,
    //   width: "180px",
    //   height: "48px",
    //   position: (x, y),
    //   format: {
    //     font_family: "Gilroy",
    //     font_size: "20px",
    //     text_align: "left",
    //     font_weight: "700",
    //   },
    // },
  },
  selectedItem: null,
};

export const ACTIONS = {
  CHANGE_PARAMETERS: "CHANGE_PARAMETERS",
  ADD_LAYER: "ADD_LAYER",
  DELETE_LAYER: "DELETE_LAYER",
  RESIZE_ITEM: "RESIZE_ITEM",
  SET_SELECTED_ITEM: "SET_SELECTED_ITEM",
  SET_POSITION: "SET_POSITION",
  CHANGE_POSITION: "CHANGE_POSITION",
  CHANGE_STYLES: "CHANGE_STYLES",
  SET_PRICE_TAG: "SET_PRICE_TAG",
};

// reducer
export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PRICE_TAG:
      return {
        ...state,
        ...action.payload,
      };

    case ACTIONS.CHANGE_PARAMETERS:
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [action.payload.name]: action.payload.value,
        },
      };

    case ACTIONS.ADD_LAYER:
      return {
        ...state,
        layers: [...state.layers, action.payload],
        content: {
          ...state.content,
          [action.payload.id]: {
            is_custom_field: false,
            product_image: action.payload.image || "",
            field_name: action.payload.name,
            type: action.payload.type,
            id: action.payload.id,
            width: 96,
            height: 25,
            position: { x: 20, y: 20 },
            format: {
              font_family: "Gilroy",
              font_size: 14,
              text_align: "left",
              font_weight: 400,
            },
          },
        },
        selectedItem: {
          is_custom_field: false,
          product_image: "",
          field_name: action.payload.name,
          type: action.payload.type,
          id: action.payload.id,
          leyer_name: action.payload.name,
          width: 160,
          height: 48,
          position: { x: 20, y: 20 },
          format: {
            font_family: "Gilroy",
            font_size: 14,
            text_align: "left",
            font_weight: 400,
          },
        },
      };

    case ACTIONS.DELETE_LAYER:
      // eslint-disable-next-line no-case-declarations
      const newLayers = state.layers.filter(
        (layer) => layer.id !== action.payload,
      );
      // eslint-disable-next-line no-case-declarations
      const newContent = { ...state.content };
      delete newContent[action.payload];
      return {
        ...state,
        layers: newLayers,
        content: newContent,
      };

    case ACTIONS.CHANGE_POSITION: {
      if (!state.content[state.selectedItem?.field_name]) {
        return state;
      }
      return {
        ...state,
        content: {
          ...state.content,
          [state.selectedItem.field_name]: {
            ...state.content[state.selectedItem.field_name],
            position: action.payload,
          },
        },
        selectedItem: {
          ...state.selectedItem,
          position: action.payload,
        },
      };
    }

    case ACTIONS.RESIZE_ITEM: {
      if (!state.content[state.selectedItem?.field_name]) {
        return state;
      }

      return {
        ...state,
        content: {
          ...state.content,
          [state.selectedItem.field_name]: {
            ...state.content[state.selectedItem.field_name],
            width: action.payload.width,
            height: action.payload.height,
          },
        },
        selectedItem: {
          ...state.selectedItem,
          width: action.payload.width,
          height: action.payload.height,
        },
      };
    }

    case ACTIONS.SET_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.payload,
      };

    case ACTIONS.SET_POSITION:
      return {
        ...state,
        content: {
          ...state.content,
          [state.selectedItem.field_name]: {
            ...state.content[state.selectedItem.field_name],
            position: action.payload,
          },
        },
      };

    case ACTIONS.CHANGE_STYLES:
      console.log(action.payload, state);
      return {
        ...state,
        content: {
          ...state.content,
          [state.selectedItem.field_name]: {
            ...state.content[state.selectedItem.field_name],
            format: {
              ...state.content[state.selectedItem.field_name].format,
              [action.payload.name]: action.payload.value,
            },
          },
        },
        selectedItem: {
          ...state.selectedItem,
          format: {
            ...state.content[state.selectedItem.field_name].format,
            [action.payload.name]: action.payload.value,
          },
        },
      };

    default:
      return state;
  }
};

export const mainTemplateCss = {
  mainGrid: {
    gridTemplateColumns: "20% auto 20%",
    mt: "30px",
    border: "3px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "15px",
    minHeight: "500px",
    height: "70vh",
  },
};

export const sidebarsCss = {
  title: {
    p: "16px 20px",
    color: "colors.headingColor",
    fontSize: "20px",
    borderBottom: "3px solid",
    borderColor: "colors.sidebarBorder",
  },
  label: { fontSize: "14px", color: "colors.greyF9" },
  body: {
    p: "18px",
    gap: "18px",
  },
  input: {
    bg: "colors.grayF9",
    border: "none",
    borderRadius: "10px",
    p: "20px 16px",
    height: "45px",
    fontFamily: "Gilroy",
    overflow: "hidden",
    fontSize: "14px",
    _focus: {
      boxShadow: "none",
    },
  },
  numberInputStepper: {
    w: "30px",
    bg: "#D9D9D9",
    border: "none",
    m: "0",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    height: "100%",
  },
  stepper: {
    borderInlineStart: "none",
    border: "none",
    margin: 0,
    bg: "colors.greyD9",
  },
  property: {
    position: "relative",
    p: "10px 14px",
    pb: "9px",
    fontSize: "14px",
    color: "colors.text",
    background: "colors.grayF9",
    border: "3px solid #E9E9E9",
    borderRadius: "10px",
  },
  deleteIcon: {
    alt: "",
    position: "absolute",
    top: "50%",
    right: "3px",
    transform: "translateY(-48%)",
    cursor: "pointer",
  },
  noLayer: {
    position: "absolute",
    color: "#BDBDBD",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, 20%)",
    fontWeight: 700,
    width: "60%",
  },
  modalContent: {
    p: "15px 14px",
    borderRadius: "25px",
    bg: "colors.grayF9",
  },
  modalHeader: {
    color: "colors.headingColor",
    fontWeight: 700,
    fontSize: "28px",
  },
  modalCloseButton: {
    variant: "link",
    position: "absolute",
    top: "21px",
    right: "30px",
  },
  modalFooter: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    mt: "10px",
  },
  modalButton: {
    height: "50px",
    borderRadius: "10px",
    colorScheme: "gray",
    color: "colors.text",
    bg: "colors.sidebarBorder",
  },
};

export const PriceTagStyles = {
  name: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "#BDBDBD",
    fontWeight: 700,
    p: "20px",
  },
  card: {
    w: "320px",
    h: "180px",
    background: "colors.header",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "10px",
    position: "relative",
    p: "20px",
    color: "#232323",
    mt: "-50px",
  },
  helpIcon: {
    width: "48px",
    height: "48px",
    position: "absolute",
    bottom: "82px",
    right: "16px",
    cursor: "pointer",
    bg: "colors.body",
    border: "3px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "50%",
  },
  tooltip: {
    placement: "top",
    hasArrow: true,
    p: "10px 15px",
    borderRadius: "10px",
    bg: "#454545",
    color: "#fff",
    fontWeight: 700,
  },
};

export const formatterStyles = {
  formatterWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    bg: "colors.header",
  },
  iconBtn: {
    variant: "link",
    height: "36px",
    width: "36px",
  },
};

export const selectStyles = {
  container: () => ({
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    padding: "5px 5px",
    borderRadius: "10px",
    borderColor: state.selectProps.isInvalid ? "#e53e3e" : "inherit",
    boxShadow: state.selectProps.isInvalid ? "0 0 0 1px #e53e3e" : "inherit",
    "&:hover": state.selectProps.isInvalid ? {} : { borderColor: "#cbd5e0" },
    fontWeight: "500",
    fontSize: "15px",
    background: "var(--ck-colors-colors-header)",
    color: "var(--ck-colors-colors-text)",
  }),
  menu: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 112,
    background: "var(--ck-colors-colors-header)",
  }),
  menuList: () => ({
    padding: "0",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--ck-colors-colors-text)",
  }),
  option: (provided) => ({
    ...provided,
    transition: "0.15s all ease-in-out",
    background: "var(--ck-colors-colors-header)",
    "&:hover": {
      background: "var(--ck-colors-colors-sidebarBorder)",
    },
    "&:focus": {
      background: "var(--ck-colors-colors-sidebarBorder)",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};
