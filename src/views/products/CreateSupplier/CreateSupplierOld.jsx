import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useHookForm from "@/hooks/useHookForm";
import useLatestClosure from "@/hooks/useLatestClosure";
import useToast from "@/hooks/useToast";
import { createSupplier, getSupplier, updateSupplier } from "@/services";
import { cloneDeep } from "lodash";
import { Button, Flex, SimpleGrid } from "@chakra-ui/react";
import StepperForm from "@/components/templates/StepperForm/StepperForm";
import StepViewer from "@/components/molecules/StepViewer";
import GoBack from "@/components/molecules/GoBack";
import {
  stepper,
  steps,
  ACTIONS,
  initialValues,
  formReducer,
  schema,
  fieldNames,
  submitFilesToWorker,
} from "./data";

export default function CreateSupplier() {
  const { supplier_id } = useParams();
  const [formValues, dispatchForm] = useReducer(formReducer, initialValues);
  const [step, setStep] = useState(stepper.currStep);
  const [docs, setDocs] = useState([]);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    trigger,
    handleSubmit,
    reset,
  } = useHookForm(initialValues, schema);

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
        queryKey: ["suppliers", supplier_id],
        refetchType: "all",
      });
      addToast({
        title: supplier_id
          ? "Supplier updated successfully"
          : "Supplier created successfully",
        status: "success",
      });
      navigate("/products/suppliers");
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  console.log(docs);

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

  const stepFieldsCorrect = (currStep) => {
    return trigger(fieldNames[currStep], {
      shouldFocus: true,
    });
  };

  const getPrevBtnState = (currStep) => {
    let prevBtnState;

    if (currStep === stepper.firstStep) {
      prevBtnState = {
        value: "",
        onClick: () => {},
        type: "button",
        isLoading: null,
        form: null,
        visibility: "hidden",
      };
    }

    if (currStep !== stepper.firstStep) {
      prevBtnState = {
        value: "Previous",
        onClick: () => {
          setStep(stepper.prevStep());
        },
        type: "button",
        isLoading: null,
        form: null,
        visibility: "visible",
      };
    }

    return prevBtnState;
  };

  const getNextBtnState = (currStep) => {
    let nextBtnState;

    if (currStep === stepper.lastStep) {
      nextBtnState = {
        value: supplier_id ? "Update" : "Create",
        onClick: () => {},
        type: "submit",
        isLoading: isSubmitting,
        form: "supplier-form",
        visibility: "visible",
      };
    }

    if (currStep !== stepper.lastStep) {
      nextBtnState = {
        value: "Next",
        onClick: async (e) => {
          e.preventDefault();

          if (await stepFieldsCorrect(step)) {
            setStep(stepper.nextStep());
          }
        },
        type: "button",
        isLoading: null,
        form: null,
        visibility: "visible",
      };
    }

    return nextBtnState;
  };

  const prevBtnState = getPrevBtnState(step);
  const nextBtnState = getNextBtnState(step);

  useEffect(() => {
    if (supplier_id) {
      // supplier
      // const serverFetchedDocs = reformatDocs(supplier.files);
      // setDocs(serverFetchedDocs);

      dispatchForm({ type: ACTIONS.SET_VALUES, payload: {} });
    }
  }, [supplier_id]);

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  useEffect(() => {
    if (supplier_id) {
      getSupplier(supplier_id).then((res) => {
        reset(res);
      });
    }
  }, [supplier_id, reset]);

  useEffect(() => {
    return () => {
      stepper.reinitialize();
      docs?.forEach((doc) => URL.revokeObjectURL(doc.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction="column" gap={16}>
      <GoBack
        isDirty={isDirty}
        title={supplier_id ? "Edit a Supplier" : "Create a Supplier"}
        modal={{
          title: "Cancel supplier creation?",
          desciption:
            "Are you sure you want to exit and cancel supplier creation?",
        }}
        backUrl="/products/suppliers"
      />

      <SimpleGrid gridTemplateColumns="25% 70%" px="20px" mt="-50px">
        <Flex />
        <Flex direction="column" h="78vh">
          <Flex direction="column" gap="50px">
            <StepViewer currStep={step} steps={steps} />
            <StepperForm
              currStep={step}
              steps={steps}
              onSubmit={onSubmit}
              control={control}
              errors={errors}
              docs={docs}
              setDocs={setDocs}
            />
          </Flex>

          <Flex justifyContent="space-between" mt="auto">
            <Button
              w="150px"
              h="50px"
              type={prevBtnState.type}
              form={prevBtnState.form}
              isLoading={prevBtnState.isLoading}
              onClick={prevBtnState.onClick}
              visibility={prevBtnState.visibility}
              colorScheme="grey"
              color="brand.500"
            >
              {prevBtnState.value}
            </Button>
            <Button
              w="150px"
              h="50px"
              type={nextBtnState.type}
              form={nextBtnState.form}
              isLoading={nextBtnState.isLoading}
              onClick={nextBtnState.onClick}
              visibility={nextBtnState.visibility}
              colorScheme="grey"
              color="brand.500"
            >
              {nextBtnState.value}
            </Button>
          </Flex>
        </Flex>
      </SimpleGrid>
    </Flex>
  );
}
