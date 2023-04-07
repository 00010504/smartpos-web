import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import { uid } from "radash";
import { useTranslation } from "react-i18next";
import { Button, Heading, useDisclosure, SimpleGrid } from "@chakra-ui/react";
import useHookForm from "@/hooks/useHookForm";
import useToast from "@/hooks/useToast";
import createSchema from "@/helpers/createSchema";
import Drawer from "@/components/molecules/Drawer";
import LeftIcon from "@/components/atoms/Icons/Left";
import ImportFirstStep from "./ImportFirstStep";
import ImportSecondStep from "./ImportSecondStep";

const schema = createSchema({
  name: "default",
  store: "select",
  type: "select",
  supplier: "select",
});
const values = {
  name: "",
  store: "",
  generate_barcode: true,
  type: "",
  supplier: "",
  url: "",
  generate_sku: true,
};

const getPreviousImports = () => {
  try {
    const previous = JSON.parse(sessionStorage.getItem("import"));
    return previous;
  } catch (e) {
    return {};
  }
};

function Import() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    if (file) {
      setStep(2);
    }
    if (!file) {
      addToast({ title: "Please, upload a file to continue" });
    }
    if (step === 2) {
      // const import_id = uuidv4();
      const import_id = uid(18, "-");
      const payload = {
        ...data,
        store: data.store.value,
        type: data.type.value,
        supplier: data.supplier.value,
      };

      sessionStorage.setItem(
        "import",
        JSON.stringify({
          ...getPreviousImports(),
          [import_id]: payload,
        }),
      );
      navigate(`/products/import/check/${import_id}`);
    }
  });

  useEffect(() => {
    if (step === 1) {
      setValue("type", {
        value: "csv",
        label: "CSV",
      });
      setValue("url", "url");
      setValue("supplier", {
        value: "supplier",
        label: "Supplier",
      });
    }
    if (step === 2) {
      setValue("supplier", "");
      setValue("url", "");
      setValue("type", "");
    }
  }, [setValue, step]);

  return (
    <>
      <Button height="45px" width="100px" onClick={onOpen} color="#fff">
        {t("create")}
      </Button>
      <Drawer
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading size="lg">{t("new_import")}</Heading>}
        Body={
          <form onSubmit={onSubmit} id="import-form">
            {step === 1 && (
              <ImportFirstStep
                control={control}
                onSubmit={onSubmit}
                errors={errors}
                file={file}
                setFile={setFile}
              />
            )}
            {step === 2 && (
              <ImportSecondStep
                control={control}
                errors={errors}
                file={file}
                setValue={setValue}
                getValue={getValues}
                hasUploaded={hasUploaded}
                setHasUploaded={setHasUploaded}
              />
            )}
          </form>
        }
        Footer={
          <SimpleGrid
            width="100%"
            gridTemplateColumns={step === 1 ? "1fr 1fr" : "50px auto"}
            spacing={5}
          >
            <Button
              height="52px"
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              colorScheme="gray"
            >
              {step === 1 ? t("cancel") : <LeftIcon color="colors.text" />}
            </Button>

            {step === 1 && (
              <Button height="52px" color="#fff" onClick={onSubmit}>
                {t("continue")}
              </Button>
            )}

            {step === 2 && (
              <Button
                isDisabled={!hasUploaded}
                type="submit"
                form="import-form"
                height="52px"
                color="#fff"
              >
                {t("continue")}
              </Button>
            )}
          </SimpleGrid>
        }
      />
    </>
  );
}

export default Import;
