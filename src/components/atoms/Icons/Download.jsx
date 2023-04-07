import { createIcon } from "@chakra-ui/icons";

const DownloadIcon = createIcon({
  displayName: "DownloadIcon",
  defaultProps: {
    width: "24px",
    height: "24px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      stroke="currenColor"
      d="M18 22a2 2 0 0 0 2-2v-5l-5 4v-3H8v-2h7v-3l5 4V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12zM13 4l5 5h-5V4z"
    />
  ),
});

export default DownloadIcon;
