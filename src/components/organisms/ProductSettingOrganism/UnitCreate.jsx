/* eslint-disable react-hooks/exhaustive-deps */
import Select from "@/components/molecules/Select/Select";
import Drawer from "@/components/molecules/Drawer";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import useToast from "@/hooks/useToast";
import {
  getUnitById,
  getUnits,
  updateMainUnit,
  updateSingleUnit,
} from "@/services";
import {
  useDisclosure,
  Button,
  VStack,
  Input,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import { t } from "i18next";
import { func, PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import edit from "@/assets/edit.svg";
import { useLangContext } from "@/contexts/langContext";

const values = { unit: "", accuracy: "" };
const schema = createSchema({ unit: "select", accuracy: "select" });

export default function UnitCreate({ id, type, recall }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUnit, setSelectedUnit] = useState({});
  const [data, setData] = useState([]);
  const { addToast } = useToast();
  const [abbValue, setAbbValue] = useState("");
  const { lang } = useLangContext();

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useHookForm(values, schema);

  const value = watch("unit");

  const getData = async () => {
    const backData = await getUnits();
    setData(backData);
  };

  const unitOptions = [];
  data?.units?.forEach((unit) => {
    unitOptions.push({
      label: unit?.long_name_translation[lang],
      value: unit?.id,
    });
  });

  const accuracyOptions = [];
  data?.precisions?.forEach((acc) => {
    return accuracyOptions.push({ label: `${acc?.value}`, value: acc?.id });
  });

  const getMeasurementUnitById = async () => {
    if (id !== null && type === "edit") {
      const singleUnitData = await getUnitById(id);
      setValue("unit", {
        label: singleUnitData?.long_name_translation?.en,
        value: singleUnitData?.unit_id,
      });
      setAbbValue(singleUnitData?.short_name);
      setValue("accuracy", {
        label: singleUnitData?.precision?.value,
        value: singleUnitData?.precision?.id,
      });
      setValue("abbreviation", singleUnitData?.units?.short_name);
    }
  };

  const onSubmitHandle = handleSubmit((formData) => {
    const payload = {
      unit_id: formData.unit.value,
      precision_id: formData.accuracy.value,
    };
    if (type === "create") {
      updateMainUnit(payload)
        .then(() => {
          addToast({
            title: t("unit_created"),
            status: "success",
          });
        })
        .then(() => {
          onClose();
        })
        .then(() => {
          recall();
        })
        .catch(() => {
          addToast({
            title: t("could_not_create"),
          });
        });
    }

    if (type === "edit") {
      updateSingleUnit(id, payload)
        .then(() => {
          addToast({
            title: t("unit_changed"),
            status: "success",
          });
        })
        .then(() => {
          onClose();
        })
        .then(() => {
          recall();
        })
        .catch(() => {
          addToast({ title: t("could_not_change") });
        });
    }
  });

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      getMeasurementUnitById();
    }
  }, [id, isOpen]);

  useEffect(() => {
    const measurementUnit = data?.units?.find(
      (unit) => unit.id === value?.value,
    );
    if (measurementUnit) {
      setSelectedUnit(measurementUnit);
    }
  }, [value]);

  return (
    <>
      {type === "create" && (
        <Button {...addBtn} onClick={onOpen}>
          {t("add")}
        </Button>
      )}
      {type === "edit" && (
        <Button data-action="edit" variant="link" onClick={onOpen}>
          <Image src={edit} alt="edit" cursor="pointer" />
        </Button>
      )}
      <Drawer
        onCloseComplete={() => {
          reset(values);
          setSelectedUnit({});
        }}
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        Header={t("add_unit")}
        Body={
          <form onSubmit={onSubmitHandle} id="add-unit">
            <VStack spacing={4} align="stretch">
              <Select
                name="unit"
                label={t("unit")}
                control={control}
                errors={errors}
                options={unitOptions}
                selectProps={{
                  placeholder: t("select_unit"),
                }}
              />
              <FormLabel>{t("abbreviation")}</FormLabel>
              <Input
                name="abbreviation"
                disabled
                placeholder={t("abbreviation")}
                fontSize="md"
                size="lg"
                rounded="lg"
                borderColor="grey.800"
                _placeholder={{ color: "inherit" }}
                value={selectedUnit?.short_name || "" || abbValue}
              />
              <Select
                name="accuracy"
                label={t("accuracy")}
                control={control}
                errors={errors}
                options={accuracyOptions}
                selectProps={{ placeholder: t("select_unit") }}
              />
            </VStack>
          </form>
        }
        Footer={
          <Button {...addBtn} type="submit" form="add-unit">
            {type === "create" ? t("add") : t("save")}
          </Button>
        }
      />
    </>
  );
}

UnitCreate.defaultProps = {
  id: "",
  type: "",
  recall: func,
};
UnitCreate.propTypes = {
  recall: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.string,
};
const addBtn = {
  w: "100%",
  colorScheme: "gray",
  color: "brand.500",
  size: "lg",
  rounded: "lg",
  mt: 3,
};
