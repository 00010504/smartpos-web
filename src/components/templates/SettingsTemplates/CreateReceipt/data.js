export const ACTIONS = {
  CHANGE_TEXT_FIELD: "CHANGE_TEXT_FIELD",
  SET_BLOCKS: "SET_BLOCKS",
  CHECK_BLOCK: "CHECK_BLOCK",
  CHECK_FIELD: "CHECK_FIELD",
  REPOSITION_FIELD: "REPOSITION_FIELD",
  SET_DATA: "SET_DATA",
  IMAGE_PREVIEW: "IMAGE_PREVIEW",
  ALL_CHECKBOX_TOOGLE: "ALL_CHECKBOX_TOOGLE",
};

export const initialState = {
  field_ids: [],
  blocks: [],
  logo: {
    image: "",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  message: "",
  name: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_TEXT_FIELD:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case ACTIONS.SET_BLOCKS:
      return {
        ...state,
        blocks: action.payload,
      };
    case ACTIONS.CHECK_BLOCK:
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id === action.payload) {
            return {
              ...block,
              is_active: !block.is_active,
            };
          }
          return block;
        }),
      };
    case ACTIONS.CHECK_FIELD:
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id === action.payload.blockId) {
            return {
              ...block,
              fields: block.fields.map((field) => {
                if (field.id === action.payload.fieldId) {
                  return {
                    ...field,
                    is_added: !field.is_added,
                  };
                }
                return field;
              }),
            };
          }
          return block;
        }),
      };
    case ACTIONS.REPOSITION_FIELD:
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id === action.payload.blockId) {
            return {
              ...block,
              fields: action.payload.fields,
            };
          }
          return block;
        }),
      };
    case ACTIONS.SET_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.IMAGE_PREVIEW:
      return {
        ...state,
        image_preview: action.payload,
      };
    case ACTIONS.ALL_CHECKBOX_TOOGLE:
      // payload is block id
      return {
        ...state,
        blocks: state.blocks.map((block) => {
          if (block.id === action.payload.blockId) {
            return {
              ...block,
              fields: block.fields.map((field) => {
                return {
                  ...field,
                  is_added: action.payload.value,
                };
              }),
            };
          }
          return block;
        }),
      };
    default:
      return state;
  }
};

export const commonCSS = {
  wrapper: {
    p: "21px 24px",
    bg: "colors.receiptBlock",
    borderRadius: "16px",
    position: "relative",
  },
  heading: {
    fontSize: "20px",
    size: "md",
    color: "colors.headingColor",
    mb: "20px",
  },
};

export const pCSS = {
  button: {
    height: "48px",
    position: "absolute",
    bottom: "20px",
    fontSize: "18px",
    width: "85%",
    type: "submit",
    color: "#fff",
  },
  input: {
    width: "100%",
    height: "45px",
    fontSize: "15px",
    borderRadius: "10px",
    backgroundColor: "colors.body",
  },
};

export const bCSS = {
  blockHeading: {
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export const rCSS = {
  cheque: {
    p: "20px",
    bg: "#fff",
    margin: "0 auto",
    width: "80mm",
    borderRadius: "4px",
    color: "#000",
  },
  content: {
    mt: "12px",
    borderTop: "2px dashed",
    borderColor: "colors.sidebarBorder",
    pt: "12px",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: "2px",
    fontSize: "14px",
  },
};
