import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesQuery, getMeasurementUnitsQuery } from "@/queries";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  FormLabel,
  Grid,
  GridItem,
  VisuallyHidden,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import CustomRadio from "@/components/molecules/CustomRadio";
import CustomSwitch from "@/components/molecules/CustomSwitch";
import Multiselect from "@/components/molecules/Multiselect/Multiselect";
import Upload from "@/components/molecules/Upload/Upload";
import Select from "@/components/molecules/Select/Select";
import Input from "@/components/molecules/Input/Input";
import Alert from "@/components/atoms/SVGs/Alert";
import { useLangContext } from "@/contexts/langContext";
import {
  inputStyles,
  typesOptions,
  markingOptions,
  toolTipOptions,
} from "./data";

let lastClickedImg = null;

function MainCreateProduct({
  control,
  errors,
  getValue,
  setValue,
  images,
  setImages,
  watch,
  refs,
}) {
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const { lang } = useLangContext();

  const { t } = useTranslation();

  const { data: categoriesData } = useQuery({
    ...getCategoriesQuery(),
  });
  const { data: measurementUnitsData } = useQuery({
    ...getMeasurementUnitsQuery(),
  });

  const productTypeValue = watch("product_type_id");
  const mxikLength = watch("mxik_code");

  const handleGenerateSKU = () => {
    setGenerateLoading(true);
    const timeout = setTimeout(() => {
      setValue("sku", Math.floor(Math.random() * 1000000000).toString());
      setGenerateLoading(false);
      clearTimeout(timeout);
    }, 300);
  };

  /*  ⏺  IMAGE UPLOAD FUNCTIONS  ⏺  */

  const dropHandler = (acceptedImgs) => {
    setImages((prev) => {
      const newImgs = acceptedImgs.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      return [...prev, ...newImgs];
    });
  };

  const imageSelectHandler = (i) => {
    setSelectedImageIndex(i);
    lastClickedImg = i;
  };

  const outsideImageClickHandler = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(null);
    }
  };

  const imageSelectAsMainHandler = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(null);
      setImages((prev) => {
        const copiedImgs = [...prev];
        const removedImg = copiedImgs.splice(lastClickedImg, 1);
        return removedImg.concat(copiedImgs);
      });
    }
  };

  const imageRemoveHandler = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(null);
      setImages((prev) => prev.filter((_, i) => i !== lastClickedImg));
    }
  };

  useEffect(() => {
    if (categoriesData) {
      const options = categoriesData.data.map((top) => {
        return {
          label: top.name,
          options: top.children.map((child) => {
            return {
              label: child.name,
              value: child.id,
            };
          }),
        };
      });

      setCategories(options);
    }

    console.log(lang);

    if (measurementUnitsData) {
      const options = measurementUnitsData.data.map((unit) => {
        return { value: unit.id, label: unit.long_name_translation[lang] };
      });

      setMeasurementUnits(options);
    }
  }, [categoriesData, measurementUnitsData, lang]);

  return (
    <section>
      <VisuallyHidden
        id="main"
        height="150px"
        pos="absolute"
        top={0}
        ref={refs[0]}
      />
      <SectionHeader title={t("main")} />
      <Grid
        gap="24px 30px"
        templateAreas={
          "'type type' 'name name' 'barcode sku' 'unitType mxik' 'category marking' 'image image'"
        }
      >
        <GridItem area="type">
          <CustomRadio
            options={typesOptions}
            active={productTypeValue}
            onChange={(val) => setValue("product_type_id", val)}
          />
        </GridItem>
        <GridItem area="name">
          <Input
            name="name"
            control={control}
            errors={errors}
            label={`${t("name")}`}
            isRequired
            inputProps={{
              ...inputStyles,
              placeholder: t("enter_product_name"),
            }}
          />
        </GridItem>
        <GridItem area="barcode">
          <Input
            name="barcode"
            control={control}
            errors={errors}
            label={`${t("barcode")}`}
            inputProps={{
              ...inputStyles,
              placeholder: t("enter_barcode"),
            }}
            rightElementValue={
              <Alert {...toolTipOptions} label={t("barcode_tooltip")} />
            }
          />
        </GridItem>
        <GridItem area="sku">
          <Input
            name="sku"
            control={control}
            errors={errors}
            label={`${t("sku")}`}
            isRequired
            inputProps={{
              ...inputStyles,
              placeholder: t("enter_sku"),
            }}
            rightElementValue={
              <Button
                isLoading={generateLoading}
                onClick={handleGenerateSKU}
                variant="link"
                color="colors.link"
                fontSize="14px"
                position="absolute"
                right="15px"
                mt="3px"
              >
                {t("generate")}
              </Button>
            }
          />
        </GridItem>
        <GridItem area="unitType">
          <Select
            name="measurement_unit_id"
            errors={errors}
            control={control}
            label={t("unit_type")}
            options={measurementUnits ?? []}
            isRequired
            rightElementValue={
              <Alert {...toolTipOptions} label={t("unitType_tooltip")} />
            }
          />
        </GridItem>
        <GridItem area="mxik">
          <Input
            name="mxik_code"
            control={control}
            errors={errors}
            label={`${t("mxik_code")}`}
            inputProps={{
              ...inputStyles,
              placeholder: t("enter_mxik_code"),
              maxLength: 17,
            }}
            rightElementValue={
              <Flex ml="-48px" alignItems="center">
                <Text mt="2px" fontSize="16px" color="#BDBDBD" width="45px">
                  {mxikLength?.length}/17
                </Text>
                <Alert {...toolTipOptions} label={t("mxik_code_tooltip")} />
              </Flex>
            }
          />
        </GridItem>
        <GridItem area="category">
          <Multiselect
            value={watch("category_id")}
            onChange={(option) => setValue("category_id", option)}
            label={t("category")}
            options={categories ?? []}
          />
        </GridItem>
        <GridItem area="marking">
          <CustomSwitch
            label={t("marking")}
            options={markingOptions}
            active={getValue("is_marking")}
            onChange={(val) => setValue("is_marking", val)}
          />
        </GridItem>
        <GridItem area="image">
          <FormLabel>{t("image")}</FormLabel>
          <Upload
            label={t("drag_an_image_or_click")}
            selectedFileIndex={selectedImageIndex}
            onSelectAsMain={imageSelectAsMainHandler}
            onOutsideClick={outsideImageClickHandler}
            onSelect={imageSelectHandler}
            onRemove={imageRemoveHandler}
            onDrop={dropHandler}
            files={images}
          />
        </GridItem>
      </Grid>
    </section>
  );
}

export default MainCreateProduct;

MainCreateProduct.defaultProps = {
  images: [],
};

MainCreateProduct.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  watch: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({})),
  setImages: PropTypes.func.isRequired,
  refs: PropTypes.arrayOf(
    PropTypes.exact({ current: PropTypes.instanceOf(Element) }),
  ).isRequired,
};
