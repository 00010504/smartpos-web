import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Flex, SimpleGrid, Text, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Input from "@/components/molecules/Input/Input";
import Select from "@/components/molecules/Select/Select";
import FileUpload from "@/components/molecules/Upload/FileUpload";
import DownloadIcon from "@/assets/download.svg";
import { getShops, getExampleExcel } from "@/services";
import { styles } from "./data";

function ImportFirstStep({ control, errors, file, setFile }) {
  const { t } = useTranslation();
  const [shops, setShops] = useState();

  useEffect(() => {
    getShops().then((res) =>
      setShops(
        res.data.map((shop) => {
          return { value: shop.id, label: shop.title };
        }),
      ),
    );
  }, []);

  const downloadExample = () => {
    getExampleExcel().then((res) => {
      const link = document.createElement("a");
      link.href = res.id;
      link.setAttribute("download", "example.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <SimpleGrid columns={1} spacing={1}>
      <Input
        name="name"
        label={t("import_name")}
        control={control}
        errors={errors}
        inputProps={{
          placeholder: t("enter_import_name"),
          ...styles.inputStyles,
        }}
        formControlProps={{
          my: "5",
          marginTop: 5,
        }}
      />
      <Select
        name="store"
        label={t("store")}
        control={control}
        errors={errors}
        styles={styles.selectStyles}
        options={shops || []}
        selectProps={{
          placeholder: t("select"),
        }}
      />
      <Box mt={8}>
        <FileUpload
          h="180px"
          file={file}
          setFile={setFile}
          uploadType="excel"
        />
      </Box>
      <Flex mt={10} alignItems="center" justifyContent="space-between">
        <Text fontSize={14} width="56%" lineHeight={1.3}>
          <span style={{ color: "#256DF6" }}>
            {t("dont_know_how_fill_it_out")}
          </span>{" "}
          <br />
          {t("download_template")}
        </Text>
        <Image
          onClick={downloadExample}
          src={DownloadIcon}
          alt=""
          width="50px"
          cursor="pointer"
        />
      </Flex>
    </SimpleGrid>
  );
}

export default ImportFirstStep;

ImportFirstStep.defaultProps = {
  file: null,
};

ImportFirstStep.propTypes = {
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
  }),
  setFile: PropTypes.func.isRequired,
};
