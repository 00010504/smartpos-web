import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import useToast from "@/hooks/useToast";
import ImportCheckTable from "@/components/organisms/ImportCheckTable";
import {
  getExcelFile,
  sendImportToValidation,
  getImportPropertiesTemplate,
} from "@/services";
import GoBack from "@/components/molecules/GoBack";
import {
  ACTIONS,
  checkHeaders,
  importReducer,
  initialState,
  getFilePayload,
} from "./data";

export default function ImportCheckTemplate() {
  const { file_uid } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [{ isWorksheetReady, headers, data }, dispatchWorksheet] = useReducer(
    importReducer,
    initialState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [importProperties, setImportProperties] = useState([]);
  const [propertyTemplates, setPropertyTemplates] = useState([]);
  const [requiredProperties, setRequiredProperties] = useState([]);

  const isDisabled = useMemo(() => {
    if (isLoading) return true;
    if (isWorksheetReady) {
      const isValid = checkHeaders(
        headers,
        importProperties,
        propertyTemplates,
      );
      return !isValid;
    }

    return true;
  }, [
    headers,
    importProperties,
    propertyTemplates,
    isLoading,
    isWorksheetReady,
  ]);

  const handleContinue = async () => {
    setIsLoading(true);

    const leftouts = requiredProperties.filter((required_property) => {
      const foundProperty = importProperties.find(
        (property) => property.field_name === required_property,
      );
      if (foundProperty) {
        return !foundProperty.is_uploadable;
      }

      return true;
    });

    if (leftouts.length) {
      addToast({ title: `${leftouts[0]} is a required column` });
      setIsLoading(false);
      return;
    }

    const payload = {
      ...getFilePayload(file_uid),
      import_properties: importProperties,
    };

    try {
      await sendImportToValidation(payload);
      navigate(`/products/import/validation/${file_uid}`);
    } catch (err) {
      addToast({ title: err });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const payload = getFilePayload(file_uid);
    if (payload) {
      getExcelFile(payload.url, {
        sheetRows: 5,
      })
        .then((wb) => {
          dispatchWorksheet({ type: ACTIONS.setWorksheet, payload: { wb } });
        })
        .catch((err) => console.log(err));
    } else {
      navigate("/products/import");
    }
  }, [file_uid, navigate]);

  useEffect(() => {
    setImportProperties((prev) => {
      const copied = [...prev];
      const newProps = headers.map((header, index) => {
        const carried = copied[index] || {};
        const is_required = requiredProperties.includes(header);

        copied[index] = {
          field_name: header,
          sequence_number: index,
          is_uploadable: true,
          is_new: false,
          is_attribute: false,
          is_required,
          ...carried,
        };
        return copied[index];
      });
      return newProps;
    });
  }, [headers, requiredProperties]);

  useEffect(() => {
    getImportPropertiesTemplate()
      .then((res) => {
        const requiredTemplates = res.reduce((acc, curr) => {
          if (curr.is_required) {
            return acc.concat(curr.name);
          }
          return acc;
        }, []);

        setRequiredProperties(requiredTemplates);
        setPropertyTemplates(res.map((template) => template.name));
      })
      .catch(() => {
        addToast({ title: "couldn't fetch property templates" });
      });
  }, [addToast]);

  return (
    <Flex
      flexDir="column"
      justifyContent="space-between"
      px="8"
      pb={0}
      height="100%"
    >
      <Box>
        <GoBack
          title={t("checking_correctness_of_fields")}
          isDirty
          modal={{
            title: t("are_you_sure_want_to_leave"),
            description: t("data_entered_will_be_lost"),
          }}
        />
        <br />
        <Box overflow="auto">
          <ImportCheckTable
            isWorksheetReady={isWorksheetReady}
            headers={headers}
            data={data}
            dispatchWorksheet={dispatchWorksheet}
            setImportProperties={setImportProperties}
            importProperties={importProperties}
            propertyTemplates={propertyTemplates}
          />
        </Box>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mt="50px">
        <Text>{t("select_which_fields")}</Text>
        <Button
          w="60"
          height="48px"
          color="#fff"
          onClick={handleContinue}
          isLoading={isLoading}
          isDisabled={isDisabled}
        >
          {t("continue")}
        </Button>
      </Flex>
    </Flex>
  );
}
