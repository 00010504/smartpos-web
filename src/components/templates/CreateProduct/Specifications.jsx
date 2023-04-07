import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Textarea,
  FormControl,
  FormLabel,
  VisuallyHidden,
} from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import Input from "@/components/molecules/Input/Input";
import Select from "@/components/molecules/Select/Select";
import Alert from "@/components/atoms/SVGs/Alert";
import { inputStyles, toolTipOptions } from "./data";

function SpecificationsCreateProduct({ control, errors, setValue }) {
  const [description, setDescription] = useState("");
  const { t } = useTranslation();

  return (
    <Box pos="relative">
      <VisuallyHidden
        id="specifications"
        height="150px"
        pos="absolute"
        top="-72px"
      />
      <Box pt={12}>
        <SectionHeader title={t("specifications")} />
        <Grid
          gap="24px 30px"
          templateAreas={"'brand tags' 'description description'"}
        >
          <GridItem area="brand">
            <Select
              name="brand_id"
              errors={errors}
              control={control}
              label={t("brand")}
              rightElementValue={
                <Alert {...toolTipOptions} label={t("unitType_tooltip")} />
              }
              options={[]}
            />
          </GridItem>
          <GridItem area="tags">
            <Input
              name="tags"
              control={control}
              errors={errors}
              label={`${t("tags")}`}
              inputProps={{
                ...inputStyles,
                placeholder: t("enter_tags"),
              }}
            />
          </GridItem>
          <GridItem area="description">
            <FormControl>
              <FormLabel>{t("description")}</FormLabel>
              <Textarea
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValue("description", description);
                }}
                value={description}
                {...inputStyles}
                height="150px"
                placeholder={t("enter_description")}
                padding="18px"
                resize="none"
                background="colors.grayF9"
                border="none"
                formControlProps={{ marginBottom: 4, marginTop: 6 }}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}

export default SpecificationsCreateProduct;

SpecificationsCreateProduct.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  setValue: PropTypes.func.isRequired,
};
