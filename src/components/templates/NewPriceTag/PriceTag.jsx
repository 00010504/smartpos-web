import { Box, Image, Text, IconButton, Tooltip, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";
import QuestionMarkIcon from "@/assets/icons/question-mark.svg";
import VideoIcon from "@/assets/icons/video.svg";
import { PriceTagStyles as css } from "./data";
import Formatter from "./Formatter";
import RndComponent from "./RndComponent"; /* eslint-disable react/prop-types */

function PriceTag({
  priceTagName,
  containerWidth,
  containerHeight,
  selectedItem,
  contents,
  changeResize,
  changePosition,
  styles,
}) {
  const { t } = useTranslation();
  const selectedElementPosition = {
    x: selectedItem?.value?.position?.x || 0,
    y: selectedItem?.value?.position?.y || 0,
  };

  const rndProps = {
    selectedItem,
    containerWidth: containerWidth - 20 - selectedElementPosition.x,
    containerHeight: containerHeight - 20 - selectedElementPosition.y,
    contents,
    onChangeResize: changeResize,
    onChangePosition: changePosition,
    outsideClick: () => selectedItem.onChange(null),
  };

  return (
    <Box
      bg="colors.grayF9"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text {...css.name}>{priceTagName || t("label_name")}</Text>
      <Box
        {...css.card}
        width={`${containerWidth}px`}
        height={`${containerHeight}px`}
      >
        {Object.values(contents).map((item) => {
          return (
            <RndComponent
              {...rndProps}
              key={item.field_name}
              width={item.width}
              height={item.height}
              position={item.position}
              fieldName={item.field_name}
              element={
                <>
                  {item.type === "barcode" && (
                    <Box onDoubleClick={() => selectedItem.onChange(item)}>
                      <Barcode
                        value="3673563254623654"
                        width={1}
                        height={40}
                        displayValue={false}
                      />
                    </Box>
                  )}
                  {item.type === "text" && (
                    <Text
                      color="colors.text"
                      fontSize={`${item.format.font_size}px`}
                      fontWeight={item.format.font_weight}
                      fontFamily={item.format.font_family}
                      fontStyle={item.format.font_style}
                      textAlign={item.format.text_align}
                      lineHeight={1.2}
                      wordBreak="break-all"
                      onDoubleClick={() => selectedItem.onChange(item)}
                      _focus={{
                        outline: "none",
                      }}
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {item.field_name}
                    </Text>
                  )}
                  {item.type === "image" && (
                    <Image
                      width={`${item.width}px`}
                      height={`${item.height}px`}
                      src={`${import.meta.env.VITE_CDN_URL}/${
                        item.product_image
                      }`}
                      alt={item.name}
                      draggable={false}
                      onDoubleClick={() => selectedItem.onChange(item)}
                    />
                  )}
                </>
              }
            />
          );
        })}
      </Box>
      <Formatter selectedItem={selectedItem} styles={styles} />

      <Tooltip
        label={
          <Flex gap="8px" alignItems="center">
            <Image src={VideoIcon} alt="" />
            {t("learn_how_to_create_a_price_tag")}
          </Flex>
        }
        {...css.tooltip}
      >
        <IconButton
          {...css.helpIcon}
          variant="link"
          icon={<Image src={QuestionMarkIcon} alt="" />}
        />
      </Tooltip>
    </Box>
  );
}

export default PriceTag;

PriceTag.defaultProps = {
  contents: {},
};

PriceTag.propTypes = {
  priceTagName: PropTypes.string.isRequired,
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
  contents: PropTypes.shape({}),
  // selectedItem value and onChange
  selectedItem: PropTypes.shape({
    value: PropTypes.shape({}),
    onChange: PropTypes.func,
  }).isRequired,
  styles: PropTypes.shape({
    value: PropTypes.shape({}),
    onChange: PropTypes.func,
  }).isRequired,
  changeResize: PropTypes.func.isRequired,
  changePosition: PropTypes.func.isRequired,
};
