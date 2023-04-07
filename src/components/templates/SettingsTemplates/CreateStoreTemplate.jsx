/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import GoBack from "@/components/molecules/GoBack";
import Input from "@/components/molecules/Input/Input";
import Textarea from "@/components/molecules/Textarea";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import { getSingleShop, updateShoplist, updateSingleShop } from "@/services";
import useToast from "@/hooks/useToast";
import InputMask from "@/components/molecules/Input/InputMask";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const values = {
  title: "",
  size: "",
  phone_number: "+998",
  address: "",
  description: "",
};
const schema = createSchema({
  title: "default",
  size: "default",
  phone_number: "phone",
  address: "default",
});

export default function CreateStoreTemplate() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useHookForm(values, schema);

  const mutation = () => {
    if (id) {
      return updateSingleShop.bind(null, id);
    }
    return updateShoplist;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stores"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["stores", id],
        refetchType: "all",
      });
      addToast({
        title: id
          ? `${t("store")} ${t("edited_successfully")}`
          : `${t("store")} ${t("created_successfully")}`,
        status: "success",
      });
      navigate("/settings/store");
    },
    onError: () => {
      addToast({ title: t("could_not_save") });
    },
  });

  const getSingleShopData = async () => {
    if (id) {
      const singleShopData = await getSingleShop(id);
      setValue("title", singleShopData?.title);
      setValue("size", singleShopData?.size.toString());
      setValue("phone_number", singleShopData?.phone_number);
      setValue("address", singleShopData?.address);
      setValue("description", singleShopData?.description);
    }
  };

  const onSubmit = handleSubmit((data) => {
    const payload = { ...data, size: +data.size };
    mutate(payload);
  });

  useEffect(() => {
    getSingleShopData();
  }, [id]);

  return (
    <form onSubmit={onSubmit}>
      <GoBack
        title={!id ? t("create_store") : t("edit_store")}
        backUrl="/settings/store"
        rightElement={
          <Button w={120} height="45px" type="submit" color="#fff">
            {!id ? t("create") : t("save")}
          </Button>
        }
      />
      <Box mt={3}>
        <SectionHeader title="main" />
        <SimpleGrid gap="24px 30px" columns={2} mt={7}>
          <Input
            name="title"
            control={control}
            errors={errors}
            label={t("title")}
            inputProps={{
              placeholder: t("enter_title"),
              ...styles.inputStyles,
            }}
          />
          <Input
            name="size"
            control={control}
            errors={errors}
            label={t("size")}
            inputProps={{ placeholder: t("enter_m2"), ...styles.inputStyles }}
          />
          <InputMask
            name="phone_number"
            control={control}
            errors={errors}
            label={t("phone_number")}
            inputProps={styles.inputStyles}
            maskProps={{
              placeholder: t("enter_your_phone_number"),
              mask: "+\\9\\98\\ 99 999-99-99",
            }}
          />
          <Input
            name="address"
            label={t("address")}
            control={control}
            errors={errors}
            inputProps={{
              placeholder: t("enter_address"),
              ...styles.inputStyles,
            }}
          />
        </SimpleGrid>
      </Box>
      <Textarea
        name="description"
        control={control}
        errors={errors}
        label={t("information")}
        textAreaProps={{
          placeholder: t("enter_additional_information"),
          bg: "colors.grayF9",
          p: "20px",
          _placeholder: {
            color: "#BDBDBD !important",
          },
        }}
        formControlProps={{ marginBottom: 4, marginTop: 6 }}
      />
    </form>
  );
}

const styles = {
  inputStyles: {
    padding: "24px 15px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
    _placeholder: {
      color: "#BDBDBD !important",
    },
  },
};
