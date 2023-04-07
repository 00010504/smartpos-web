import { createIcon } from "@chakra-ui/icons";

const ClientsIcon = createIcon({
  displayName: "ClientsIcon",
  defaultProps: {
    width: "18px",
    height: "18px",
  },
  viewBox: "0 0 13 16",
  path: (
    <>
      <path
        d="M10.8014 4.23284C10.8014 6.58247 8.88802 8.46649 6.5 8.46649C4.11279 8.46649 2.19864 6.58247 2.19864 4.23284C2.19864 1.88322 4.11279 0 6.5 0C8.88802 0 10.8014 1.88322 10.8014 4.23284Z"
        fill="currentColor"
      />
      <path
        d="M6.5 16C2.97568 16 0 15.436 0 13.26C0 11.0832 2.99437 10.5391 6.5 10.5391C10.0251 10.5391 13 11.1032 13 13.2792C13 15.456 10.0056 16 6.5 16Z"
        fill="currentColor"
      />
    </>
  ),
});

export default ClientsIcon;
