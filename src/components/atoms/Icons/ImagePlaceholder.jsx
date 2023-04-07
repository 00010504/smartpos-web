import { createIcon } from "@chakra-ui/icons";

const ImagePlaceholderIcon = createIcon({
  displayName: "ImagePlaceholderIcon",
  defaultProps: {
    width: "24px",
    height: "24px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm3-7 2.363 2.363L14 11l5 7H5l3-4z"
    />
  ),
});

export default ImagePlaceholderIcon;
