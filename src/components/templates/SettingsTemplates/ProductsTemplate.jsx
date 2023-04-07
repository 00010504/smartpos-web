import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { useEffect, useState } from "react";
import { deleteMainUnit, getMainUnits } from "@/services";
import UnitTable from "@/components/organisms/UnitTable";
import UnitCreate from "@/components/organisms/ProductSettingOrganism/UnitCreate";
import useToast from "@/hooks/useToast"; /* eslint-disable react-hooks/exhaustive-deps */
import { useLangContext } from "@/contexts/langContext";

const mainTableHeader = ["units", "abbrevation", "precision"];

export default function ProductsTemplate() {
  const [mainUnits, setMainUnits] = useState([]);
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { lang } = useLangContext();

  const getMainMeasurementUnits = async () => {
    const data = await getMainUnits({
      limit: "5",
      page: "1",
    });
    const unitData = [];

    data?.data?.forEach((obj) => {
      unitData.push({
        id: obj?.id,
        long_name: obj?.long_name_translation[lang],
        short_name: obj?.short_name_translation[lang],
        precision: obj?.precision,
      });
    });
    setMainUnits(unitData);
  };

  useEffect(() => {
    getMainMeasurementUnits();
  }, []);

  const mainUnitDelete = (id) => {
    deleteMainUnit(id)
      .then(() => {
        addToast({
          title: t("unit_deleted"),
          status: "success",
        });
      })
      .then(() => {
        getMainMeasurementUnits();
      })
      .catch(() => {
        addToast({
          title: t("could_not_delete"),
        });
      });
  };

  return (
    <>
      <Heading fontWeight="600" fontSize="28px">
        {t("products")}
      </Heading>
      <Breadcrumb
        options={[
          { href: "/", name: t("dashboard") },
          { name: t("settings") },
          { name: t("products") },
        ]}
        containerStyles={{ mb: 0 }}
      />
      <UnitTable
        th={mainTableHeader}
        td={mainUnits || []}
        onItemDelete={mainUnitDelete}
        recall={getMainMeasurementUnits}
      />
      <UnitCreate recall={() => getMainMeasurementUnits()} type="create" />
    </>
  );
}
