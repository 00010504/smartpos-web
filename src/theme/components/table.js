export default {
  baseStyle: {
    tbody: {
      "&:before": {
        content: "'@'",
        display: "block",
        lineHeight: "20px",
        textIndent: "-99999px",
      },
    },
    th: {
      backgroundColor: "colors.grayF9",
      _first: {
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
      },
      _last: {
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
      },
    },
    tr: {
      borderRadius: "10px",
      overflow: "hidden",
      _odd: {
        td: {
          backgroundColor: "colors.grayF9",
        },
      },
    },
    td: {
      _first: {
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
      },
      _last: {
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        // backgroundColor: "red",
      },
      fontFamily: "Inter, sans-serif",
    },
  },
};
