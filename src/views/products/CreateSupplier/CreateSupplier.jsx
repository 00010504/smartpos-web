import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Box, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import GoBack from "@/components/molecules/GoBack";
import useHookForm from "@/hooks/useHookForm";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import Input from "@/components/molecules/Input/Input";
import InputMask from "@/components/molecules/Input/InputMask";
import Upload, { UPLOAD_TYPES } from "@/components/molecules/Upload/Upload";
import { createSupplier, getSupplier, updateSupplier } from "@/services";
import useLatestClosure from "@/hooks/useLatestClosure";
import useToast from "@/hooks/useToast";
import { getSupplierQuery } from "@/queries";
import {
  initialValues,
  reformatDocs,
  schema,
  submitFilesToWorker,
} from "./data";

let lastClickedDoc = null;

function CreateSupplier() {
  const [docs, setDocs] = useState([]);
  const { supplier_id } = useParams();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: supplier } = useQuery({
    ...getSupplierQuery(supplier_id),
    enabled: !!supplier_id,
  });

  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    reset,
  } = useHookForm(initialValues, schema);

  const [selectedDocIndex, setSelectedDocIndex] = useState(null);

  const dropHandler = (acceptedDocs) => {
    const newDocs = acceptedDocs.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setDocs((prev) => {
      return [...prev, ...newDocs];
    });
  };

  const docSelectHandler = (i) => {
    setSelectedDocIndex(i);
    lastClickedDoc = i;
  };

  const outsideDocClickHandler = () => {
    if (selectedDocIndex !== null) {
      setSelectedDocIndex(null);
    }
  };

  const docRemoveHandler = () => {
    if (selectedDocIndex !== null) {
      setSelectedDocIndex(null);
      setDocs((prev) => prev.filter((_, i) => i !== lastClickedDoc));
    }
  };

  const mutation = () => {
    if (supplier_id) {
      return updateSupplier.bind(null, supplier_id);
    }
    return createSupplier;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["suppliers"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["supplier", supplier_id],
      });
      addToast({
        title: supplier_id
          ? `${t("supplier")} ${t("edited_successfully")}`
          : `${t("supplier")} ${t("created_successfully")}`,
        status: "success",
      });
      navigate("/products/suppliers");
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const onSubmit = useLatestClosure(
    handleSubmit(async (data) => {
      const copy = cloneDeep(data);
      const [submittedDocs, error] = await submitFilesToWorker(docs);
      if (error) {
        addToast({ title: "Error at webworker", description: error.message });
        return;
      }

      copy.files = submittedDocs;
      mutate(copy);
    }),
  );

  console.log(docs);

  useEffect(() => {
    if (supplier) {
      const serverFetchedDocs = reformatDocs(supplier.files);
      setDocs(serverFetchedDocs);
    }
  }, [supplier]);

  useEffect(() => {
    if (supplier_id) {
      getSupplier(supplier_id).then((res) => {
        reset(res);
      });
    }
  }, [supplier_id, reset]);

  useEffect(() => {
    return () => {
      docs?.forEach((doc) => URL.revokeObjectURL(doc.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GoBack
        type="sticky"
        isDirty={isDirty}
        title={supplier_id ? t("edit_supplier") : t("create_supplier")}
        modal={{
          title: "Cancel supplier creation?",
          desciption:
            "Are you sure you want to exit and cancel supplier action?",
        }}
        rightElement={
          <Button
            height="45px"
            w="100px"
            isLoading={isSubmitting}
            onClick={onSubmit}
            color="#fff"
          >
            {supplier_id ? t("save") : t("create")}
          </Button>
        }
        backUrl="/products/suppliers"
      />
      <SimpleGrid gap="40px" mt="20px">
        <Box>
          <SectionHeader title={t("main")} />
          <SimpleGrid mt={5} columns={2} gap="25px 32px">
            <Input
              key="supplier_company_name"
              name="supplier_company_name"
              control={control}
              errors={errors}
              label={`${t("supplier_name")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("supplier_name"),
              }}
            />
            <Input
              key="agreement_number"
              name="agreement_number"
              control={control}
              errors={errors}
              label={`${t("aggreement")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("aggreement"),
              }}
            />
            <Input
              key="name"
              name="name"
              control={control}
              errors={errors}
              label={`${t("contact")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("contact"),
              }}
            />
            <InputMask
              key="phone_number"
              name="phone_number"
              control={control}
              errors={errors}
              label={t("phone_number")}
              inputProps={inputStyles}
              maskProps={{
                placeholder: t("phone_number"),
                mask: "+\\9\\98\\ 99 999-99-99",
              }}
            />
          </SimpleGrid>
        </Box>
        <Box>
          <SectionHeader title={t("requsities")} />
          <SimpleGrid mt={5} columns={2} gap="25px 32px">
            <Input
              key="supplier_company_legal_name"
              name="supplier_company_legal_name"
              control={control}
              errors={errors}
              label={`${t("supplier_company_legal_name")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("supplier_company_legal_name"),
              }}
            />
            <Input
              key="bank_name"
              name="bank_name"
              control={control}
              errors={errors}
              label={`${t("bank_name")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("bank_name"),
              }}
            />
            <Input
              key="bank_account"
              name="bank_account"
              control={control}
              errors={errors}
              label={`${t("bank_account")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("bank_account"),
              }}
            />
            <Input
              key="legal_address"
              name="legal_address"
              control={control}
              errors={errors}
              label={`${t("legal_address")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("legal_address"),
              }}
            />
            <Input
              key="tin"
              name={t("tin")}
              control={control}
              errors={errors}
              label={`${t("tin_number")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("tin_number"),
              }}
            />
            <Input
              key="ibt"
              name="ibt"
              control={control}
              errors={errors}
              label={`${t("ibt")}`}
              isRequired
              inputProps={{
                ...inputStyles,
                placeholder: t("ibt"),
              }}
            />
          </SimpleGrid>
        </Box>
        <Box>
          <SectionHeader title={t("documents")} />
          <Upload
            label={t("drag_or_upload_files_here")}
            filetype={UPLOAD_TYPES.document}
            shouldHaveMain={false}
            files={docs}
            selectedFileIndex={selectedDocIndex}
            onDrop={dropHandler}
            onSelect={docSelectHandler}
            onRemove={docRemoveHandler}
            onOutsideClick={outsideDocClickHandler}
          />
        </Box>
      </SimpleGrid>
    </>
  );
}

export default CreateSupplier;

const inputStyles = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};
