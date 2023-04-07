import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { compact } from "lodash";
import { registerHandler, unregisterHandler } from "@/helpers/registerHandler";
import { confirmImport } from "@/services";
import ImportHandler from "@/classes/handlers/ImportHandler";
import useToast from "@/hooks/useToast";
import GoBack from "@/components/molecules/GoBack";
import ImportValidationDetail from "@/components/organisms/ImportValidationDetail/ImportValidationDetail";
import ImportValidationProcess from "@/components/organisms/ImportValidationProcess/ImportValidationProcess";

function ImportValidation() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { file_uid } = useParams();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [wsData, setWsData] = useState({
    process: 0,
    import_items_error_count: 0,
    import_validation_error: [],
  });

  let importData = sessionStorage.getItem("import");
  importData = importData ? JSON.parse(importData) : {};

  useEffect(() => {
    if (!importData[file_uid]) {
      navigate("/products/import");
    }
  }, [file_uid, importData, navigate]);

  useEffect(() => {
    const handler = new ImportHandler((data) => {
      setWsData((prev) => {
        if (data?.process > prev.process) {
          const import_validation_error = prev.import_validation_error.concat(
            compact(data.import_validation_error),
          );

          return {
            ...data,
            import_validation_error,
          };
        }
        return prev;
      });
    });
    registerHandler(handler);

    return () => {
      unregisterHandler(handler);
    };
  }, []);

  const onSubmit = () => {
    if (wsData?.process === 100 && wsData?.import_items_error_count === 0) {
      setLoading(true);
      confirmImport(wsData?.import_id)
        .then(() => {
          setLoading(false);
          navigate(`/products/import/preview/${wsData?.import_id}`);
        })
        .catch((err) => {
          setLoading(false);
          addToast({
            title: err.data.error,
          });
        });
    }
  };

  return (
    <Box padding="0 80px">
      <GoBack title={t("import")} />
      <SimpleGrid gridTemplateColumns="1fr 1fr" gap="50px" mt={6}>
        <ImportValidationProcess process={wsData.process ?? 0} />
        <ImportValidationDetail
          successItemsCount={wsData?.import_items_success_count}
          errorItemsCount={wsData?.import_items_error_count}
          validationErrors={wsData?.import_validation_error}
        />
      </SimpleGrid>
      <SimpleGrid gridTemplateColumns="1fr 1fr" gap="50px" mt="40px">
        <SimpleGrid gridTemplateColumns="1fr 1fr" gap="30px">
          <Button height="50px" colorScheme="gray" onClick={() => navigate(-1)}>
            {t("cancel")}
          </Button>
          <Button
            height="50px"
            onClick={onSubmit}
            isDisabled={
              wsData.process !== 100 ||
              wsData?.import_items_error_count !== 0 ||
              loading
            }
            color="#fff"
            isLoading={loading}
          >
            {t("continue")}
          </Button>
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}

export default ImportValidation;
