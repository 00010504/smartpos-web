import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import { getMeasurementUnitsQuery } from "@/queries";
import Select from "@/components/molecules/Select/Select";
import { useLangContext } from "@/contexts/langContext";
import AutoComplete from "@/components/molecules/Input/AutoComplete";
import Input from "../../molecules/Input/Input";

const values = {
  scales: "",
};

const schema = createSchema({
  scales: "default",
});

const autoCompleteOptions = [
  { label: "SKU", value: "sku" },
  { label: "Name", value: "name" },
  { label: "Sale Price", value: "sale_price" },
];

function NewScale({ isOpen, onClose, refetchTemplates }) {
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const { lang } = useLangContext();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useHookForm(values, schema);

  const onNewTemplateSubmit = handleSubmit((data) => {
    console.log(data);
    refetchTemplates();
    onClose();
  });

  const { data: measurementUnitsData } = useQuery({
    ...getMeasurementUnitsQuery(),
  });

  useEffect(() => {
    if (measurementUnitsData) {
      const options = measurementUnitsData.data.map((unit) => {
        return { value: unit.id, label: unit.long_name_translation[lang] };
      });

      setMeasurementUnits(options);
    }
  }, [measurementUnitsData, lang]);

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("create_a_new_scales_template")}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <SimpleGrid columns={2} gap={5} mb="20px">
            <Input
              name="scales"
              label="Name"
              control={control}
              errors={errors}
              inputProps={{
                placeholder: "Enter name",
                ...css.inputStyles,
              }}
            />
            <Select
              name="measurement_unit_id"
              errors={errors}
              control={control}
              label={t("unit_type")}
              options={measurementUnits}
            />
          </SimpleGrid>
          <AutoComplete options={autoCompleteOptions} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onNewTemplateSubmit}>{t("create")}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewScale;

const css = {
  inputStyles: {
    padding: "24px 14px",
    borderRadius: "10px",
    fontWeight: "500",
    outline: "0.5px solid rgba(0, 0, 0, 0.05)",
    fontFamily: "Gilroy",
    _placeholder: {
      color: "gray.400 !important",
    },
  },
};

NewScale.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchTemplates: PropTypes.func.isRequired,
};
