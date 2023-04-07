import { useEffect, useMemo, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientQuery } from "@/queries";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { cloneDeep } from "lodash";
import useHookForm from "@/hooks/useHookForm";
import useLatestClosure from "@/hooks/useLatestClosure";
import useToast from "@/hooks/useToast";
import Input from "@/components/molecules/Input/Input";
import CustomSwitch from "@/components/molecules/CustomSwitch";
import Select from "@/components/molecules/Select/Select";
import Textarea from "@/components/molecules/Textarea";
import DatePicker from "@/components/molecules/DatePicker/DatePicker";
import InputMask from "@/components/molecules/Input/InputMask";
import GoBack from "@/components/molecules/GoBack";
import {
  schema,
  inputStyles,
  genderOptions,
  formReducer,
  initialValues,
  getMutationFn,
  ACTIONS,
} from "./data";

function CreateClient() {
  const [formValues, dispatchForm] = useReducer(formReducer, initialValues);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { client_id } = useParams();
  const { t } = useTranslation();

  const { data: client } = useQuery({
    ...getClientQuery(client_id),
    enabled: !!client_id,
  });

  // const { data: shops } = useQuery({
  //   ...getGroupsQuery(),
  // });

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useHookForm(
    useMemo(() => formValues, [formValues]),
    schema,
  );

  const { mutate } = useMutation(getMutationFn(client_id), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clients"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["client", client_id],
      });

      addToast({
        title: t(
          `${
            client_id
              ? `${t("client")} ${t("edited_successfully")}`
              : `${t("supplier")} ${t("created_successfully")}`
          }`,
        ),
        status: "success",
      });
      navigate("/clients/list");
    },
    onError: (error) => {
      addToast({ title: error.data.error || error.data.message });
      // setLoading(false);
    },
  });

  const onSubmit = useLatestClosure(
    handleSubmit((clientData) => {
      const copiedClientData = cloneDeep(clientData);
      const birthday = format(clientData.birthday, "yyyy-MM-dd");
      copiedClientData.birthday = new Date(birthday).toISOString();
      mutate(copiedClientData);
    }),
  );

  useEffect(() => {
    dispatchForm({
      type: ACTIONS.SET_VALUES,
      payload: {
        client,
        // shops, groups
      },
    });
  }, [client, client_id]); // groups

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  console.log(getValues("sex_id"));

  return (
    <>
      <GoBack
        isDirty={isDirty}
        title={client_id ? t("edit_client") : t("create_client")}
        modal={{
          title: `Cancel client ${client_id ? "update" : "creation"}?`,
          desciption: `Are you sure you want to exit and cancel client ${
            client_id ? "update" : "creation"
          }?`,
        }}
        rightElement={
          <Button
            type="submit"
            form="client-form"
            colorScheme="gray"
            color="brand.500"
            p="0 32px"
            height="48px"
            isLoading={isSubmitting}
          >
            {client_id ? t("save") : t("create")}
          </Button>
        }
      />

      <form onSubmit={onSubmit} id="client-form">
        <SimpleGrid columns={2} gap="24px 36px" mt="20px">
          <Input
            name="first_name"
            control={control}
            errors={errors}
            label={`${t("first_name")}`}
            isRequired
            inputProps={{
              ...inputStyles,
              placeholder: t("enter_name"),
            }}
          />
          <Input
            name="last_name"
            control={control}
            errors={errors}
            label={`${t("surname")}`}
            isRequired
            inputProps={{
              ...inputStyles,
              placeholder: t("surname"),
            }}
          />
          <CustomSwitch
            label={t("gender")}
            options={genderOptions}
            active={getValues("sex_id")}
            onChange={(val) => setValue("sex_id", val)}
          />
          <DatePicker
            name="birthday"
            control={control}
            errors={errors}
            label={`${t("birthday")}`}
          />
          <Select
            name="group_id"
            control={control}
            errors={errors}
            label={t("group")}
            options={[]}
          />
          <InputMask
            name="card_number"
            control={control}
            errors={errors}
            label={t("card_number")}
            isRequired
            inputProps={inputStyles}
            maskProps={{
              placeholder: t("card"),
              mask: "9999 9999 9999 9999",
            }}
          />
          <InputMask
            name="phone_number"
            control={control}
            errors={errors}
            label={t("phone_number")}
            isRequired
            inputProps={inputStyles}
            maskProps={{
              placeholder: t("enter_your_phone_number"),
              mask: "+\\9\\98\\ 99 999-99-99",
            }}
          />
          <Input
            name="email"
            control={control}
            errors={errors}
            label={`${t("email")}`}
            inputProps={{
              ...inputStyles,
              placeholder: t("email"),
            }}
          />
        </SimpleGrid>
        <Box mt="30px">
          <Textarea
            name="info"
            control={control}
            errors={errors}
            label={t("additional_info")}
          />
        </Box>
      </form>
    </>
  );
}

export default CreateClient;
