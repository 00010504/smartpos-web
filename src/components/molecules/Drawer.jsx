import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Drawer as CkDrawer,
  Image,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import CloseModalIcon from "@/assets/close-modal.svg";

const PLACEMENTS = {
  left: "borderRightRadius",
  right: "borderLeftRadius",
  top: "borderBottomRadius",
  bottom: "borderTopRadius",
};

export default function Drawer({
  isOpen,
  onClose,
  Header,
  Body,
  Footer,
  size,
  placement,
  borderRadius,
  hideCloseBtn,
  onCloseComplete,
  customCloseBtn,
}) {
  const borderProps = {
    [PLACEMENTS[placement]]: borderRadius,
  };

  return (
    <CkDrawer
      onCloseComplete={onCloseComplete}
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      placement={placement}
    >
      <DrawerOverlay />
      <DrawerContent {...borderProps} padding="15px 10px" bg="colors.body">
        {hideCloseBtn
          ? null
          : customCloseBtn || (
              <Image
                onClick={onClose}
                src={CloseModalIcon}
                alt="close"
                width="40px"
                position="absolute"
                top="28px"
                right="30px"
                cursor="pointer"
              />
            )}
        <DrawerHeader>{Header}</DrawerHeader>
        <DrawerBody>{Body}</DrawerBody>
        <DrawerFooter>{Footer}</DrawerFooter>
      </DrawerContent>
    </CkDrawer>
  );
}

Drawer.defaultProps = {
  size: "md",
  placement: "right",
  borderRadius: "1rem",
  hideCloseBtn: false,
  customCloseBtn: null,
  onCloseComplete: null,
};

Drawer.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "full"]),
  placement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  borderRadius: PropTypes.string,
  hideCloseBtn: PropTypes.bool,
  customCloseBtn: PropTypes.element,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  Header: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
  Body: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
  Footer: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
  onCloseComplete: PropTypes.func,
};
