import { Box, SimpleGrid, Select, IconButton, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import AlignCenter from "@/components/atoms/SVGs/AlignCenter";
import AlignLeft from "@/components/atoms/SVGs/AlignLeft";
import AlignRight from "@/components/atoms/SVGs/AlignRight";
import BoldIcon from "@/components/atoms/SVGs/Bold";
import ItalicIcon from "@/components/atoms/SVGs/Italic";
import DeleteIcon from "@/assets/delete-white.svg";
import { formatterStyles as css, sidebarsCss } from "./data";

function Formatter({ styles, selectedItem }) {
  return (
    selectedItem?.value?.id && (
      <Box {...css.formatterWrapper}>
        <SimpleGrid px="20px" columns={2} gap="30px" alignItems="center">
          <SimpleGrid
            gridTemplateColumns="70% 20%"
            gap="20px"
            borderRight="3.5px solid"
            borderColor="colors.sidebarBorder"
            pr="20px"
            py="14px"
          >
            <Select
              {...sidebarsCss.input}
              height="38px"
              p={0}
              placeholder="Select option"
              value={styles.value?.font_family}
              onChange={(e) =>
                styles.onChange({
                  value: e.target.value,
                  name: "font_family",
                })
              }
            >
              <option value="Gilroy">Gilroy</option>
              <option value="Arial">Arial 2</option>
            </Select>
            <Select
              {...sidebarsCss.input}
              height="38px"
              p={0}
              value={styles.value?.font_size}
              onChange={(e) =>
                styles.onChange({
                  value: +e.target.value,
                  name: "font_size",
                })
              }
            >
              {Array.from(
                { length: 61 },
                (_, i) =>
                  i > 6 &&
                  i % 2 === 0 && (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ),
              )}
            </Select>
          </SimpleGrid>
          <SimpleGrid gridTemplateColumns="80% 20%" gap="20px">
            <SimpleGrid
              columns={5}
              pr="16px"
              py="14px"
              borderRight="3.5px solid"
              borderColor="colors.sidebarBorder"
            >
              <IconButton
                {...css.iconBtn}
                bg={
                  styles.value?.text_align === "left"
                    ? "colors.link"
                    : "colors.grayF9"
                }
                icon={
                  <AlignLeft active={styles.value?.text_align === "left"} />
                }
                onClick={() =>
                  styles.onChange({
                    value: "left",
                    name: "text_align",
                  })
                }
              />
              <IconButton
                {...css.iconBtn}
                bg={
                  styles.value?.text_align === "center"
                    ? "colors.link"
                    : "colors.grayF9"
                }
                icon={
                  <AlignCenter active={styles.value?.text_align === "center"} />
                }
                onClick={() =>
                  styles.onChange({
                    value: "center",
                    name: "text_align",
                  })
                }
              />
              <IconButton
                {...css.iconBtn}
                bg={
                  styles.value?.text_align === "right"
                    ? "colors.link"
                    : "colors.grayF9"
                }
                icon={
                  <AlignRight active={styles.value?.text_align === "right"} />
                }
                onClick={() =>
                  styles.onChange({
                    value: "right",
                    name: "text_align",
                  })
                }
              />
              <IconButton
                {...css.iconBtn}
                bg={
                  styles.value?.font_weight === 700
                    ? "colors.link"
                    : "colors.grayF9"
                }
                icon={<BoldIcon active={styles.value?.font_weight === 700} />}
                onClick={() =>
                  styles.onChange({
                    value: styles.value?.font_weight === 700 ? 400 : 700,
                    name: "font_weight",
                  })
                }
              />
              <IconButton
                {...css.iconBtn}
                bg={
                  styles.value?.font_style === "italic"
                    ? "colors.link"
                    : "colors.grayF9"
                }
                icon={
                  <ItalicIcon active={styles.value?.font_style === "italic"} />
                }
                onClick={() =>
                  styles.onChange({
                    value:
                      styles.value?.font_style === "italic"
                        ? "normal"
                        : "italic",
                    name: "font_style",
                  })
                }
              />
            </SimpleGrid>
            <IconButton
              mt="14px"
              ml={1}
              {...css.iconBtn}
              bg="#EB5757"
              width="36px"
              height="36px"
              icon={<Image width="60%" src={DeleteIcon} alt="" />}
              onClick={() =>
                styles.onChange({
                  value: "left",
                  name: "text_align",
                })
              }
            />
          </SimpleGrid>
        </SimpleGrid>
      </Box>
    )
  );
}

export default Formatter;

Formatter.propTypes = {
  selectedItem: PropTypes.shape({
    value: PropTypes.shape({
      id: PropTypes.string,
    }),
    onChange: PropTypes.func,
  }).isRequired,
  styles: PropTypes.shape({
    value: PropTypes.shape({
      font_family: PropTypes.string,
      font_size: PropTypes.number,
      text_align: PropTypes.string,
      font_weight: PropTypes.number,
      font_style: PropTypes.string,
    }),
    onChange: PropTypes.func,
  }).isRequired,
};
