export const data = {
  successfull: [
    {
      line: 5,
      message: "The value in the “RETAIL_PRICE” column is not a digit",
    },
    {
      line: 32,
      message: "The value in the “QUANTITY” column is not a digit",
    },
    {
      line: 41,
      message: "The value in the “SUPPLY_PRICE” column is not a digit",
    },
  ],
  notSuccessfull: [
    {
      line: 42,
      message: "The value in the “BARCODE” column is not correct",
    },
    {
      line: 59,
      message: "The value in the “VENDOR_CODE” column is not correct",
    },
    {
      line: 61,
      message: "The value in the 'NAME' column is not correct",
    },
    {
      line: 68,
      message: "The value in the “RETAIL_PRICE” column is not a digit",
    },
    {
      line: 74,
      message: "The value in the “QUANTITY” column is not a digit",
    },
    {
      line: 89,
      message: "The value in the “SUPPLY_PRICE” column is not a digit",
    },
    {
      line: 93,
      message: "The value in the “BARCODE” column is not correct",
    },
    {
      line: 102,
      message: "The value in the “VENDOR_CODE” column is not correct",
    },
    {
      line: 113,
      message: "The value in the 'NAME' column is not correct",
    },
    {
      line: 118,
      message: "The value in the “RETAIL_PRICE” column is not a digit",
    },
    {
      line: 137,
      message: "The value in the “QUANTITY” column is not a digit",
    },
    {
      line: 141,
      message: "The value in the “SUPPLY_PRICE” column is not a digit",
    },
    {
      line: 145,
      message: "The value in the “BARCODE” column is not correct",
    },
    {
      line: 154,
      message: "The value in the “VENDOR_CODE” column is not correct",
    },
    {
      line: 165,
      message: "The value in the 'NAME' column is not correct",
    },
    {
      line: 170,
      message: "The value in the “RETAIL_PRICE” column is not a digit",
    },
    {
      line: 189,
      message: "The value in the “QUANTITY” column is not a digit",
    },
    {
      line: 193,
      message: "The value in the “SUPPLY_PRICE” column is not a digit",
    },
  ],
};

export const switchOptions = [
  {
    label: `Not successfull (${data.notSuccessfull.length})`,
    value: false,
  },
  {
    label: `Successfull (${data.successfull.length})`,
    value: true,
  },
];

export const tableHeadings = ["line", "type_of_error"];

export const tableStyles = {
  td: {
    color: "#050929",
    fontSize: "14px",
  },
  th: {
    textTransform: "none",
    fontWeight: "600",
    padding: "15px 20px",
    color: "colors.headingColor",
    fontSize: "14px",
  },
  thead: {
    marginTop: "32px",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "colors.heading",
    borderRadius: "10px",
    display: "grid",
    gridTemplateColumns: "70px 1fr",
  },
};
