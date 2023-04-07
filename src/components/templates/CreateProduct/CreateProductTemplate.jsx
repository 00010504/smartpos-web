import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useLatestClosure from "@/hooks/useLatestClosure";
import { useTranslation } from "react-i18next";
import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import useScrollspy from "react-use-scrollspy";
import { getProductQuery, getShopsQuery } from "@/queries";
import useHookForm from "@/hooks/useHookForm";
import useToast from "@/hooks/useToast";
import LocalStorage from "@/utils/LocalStorage";
import FormNavigation from "@/components/molecules/FormNavigation";
import GoBack from "@/components/molecules/GoBack";
import MainCreateProduct from "./Main";
import Price from "./Price/Price";
import {
  styles,
  schema,
  initialValues,
  formReducer,
  ACTIONS,
  convertTo,
  refs,
  currentHashIdx,
  submitImagesToWorker,
  getMutationFn,
  reformatProductImgs,
  removeBaseEndpoint,
} from "./data";
import Remains from "./Remains/Remains";
// import SpecificationsCreateProduct from "./Specifications";
// import CustomFieldsCreateProduct from "./CustomField";
// import OptionsCreateProduct from "./Options";

function CreateProductTemplate() {
  const [productImages, setProductImages] = useState([]);
  const [formValues, dispatchForm] = useReducer(formReducer, initialValues);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { product_id } = useParams();
  const { t } = useTranslation();

  const { data: product } = useQuery({
    ...getProductQuery(product_id),
    enabled: !!product_id,
  });

  const { data: shops } = useQuery({
    ...getShopsQuery(),
  });

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useHookForm(
    useMemo(() => formValues, [formValues]),
    schema,
  );

  const activeSection = useScrollspy({
    sectionElementRefs: refs,
    offsetPx: -500,
    activeSectionDefault: currentHashIdx !== -1 ? currentHashIdx : 0,
  });

  const { mutate } = useMutation(getMutationFn(product_id), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["product", product_id],
      });
      if (LocalStorage.order?.id) {
        queryClient.invalidateQueries({
          queryKey: ["order", LocalStorage.order.id],
        });
      }
      addToast({
        title: t(
          `${
            product_id
              ? `${t("product")} ${t("edited_successfully")}`
              : `${t("product")} ${t("created_successfully")}`
          }`,
        ),
        status: "success",
      });
      navigate("/products/catalog");
    },
    onError: (error) => {
      addToast({ title: error.data.error || error.data.message });
      setLoading(false);
    },
  });

  const onSubmit = useLatestClosure(
    handleSubmit(async (data) => {
      setLoading(true);
      const [images, error] = await submitImagesToWorker(productImages);

      if (error) {
        addToast({ title: "Error at webworker", description: error.message });
        setLoading(false);
        return;
      }

      const { measurement_unit_id, category_id, barcode } = data;
      const modifiedData = convertTo("int", data);

      modifiedData.measurement_unit_id = measurement_unit_id.value;
      modifiedData.category_ids = category_id ? [category_id?.value] : [];
      modifiedData.barcode = [barcode];
      modifiedData.images = removeBaseEndpoint(images);

      mutate(modifiedData);
    }),
  );

  useEffect(() => {
    const serverFetchedImgs = reformatProductImgs(product?.images);
    setProductImages(serverFetchedImgs);

    dispatchForm({
      type: ACTIONS.SET_VALUES,
      payload: {
        product,
        shops,
      },
    });
  }, [product, shops, product_id]);

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  useEffect(() => {
    return () => {
      productImages?.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box {...styles.container}>
      <GoBack
        type="fixed"
        isDirty={isDirty}
        title={product_id ? t("edit_product") : t("create_product")}
        modal={{
          title: t("are_you_use_stop_proccess"),
        }}
        rightElement={
          <Button
            type="submit"
            form="product-form"
            colorScheme="gray"
            color="brand.500"
            p="0 32px"
            height="48px"
            isLoading={loading}
          >
            {product_id ? t("save") : t("create")}
          </Button>
        }
        backUrl="/products/catalog"
      />
      <Grid padding="20px 20px" gridTemplateColumns="15% auto" gap="100px">
        <GridItem as="aside">
          <FormNavigation
            options={[
              { name: t("main"), path: "main" },
              // { name: t("options"), path: "options" },
              { name: t("price"), path: "price" },
              { name: t("remains"), path: "remains" },
              // { name: t("specifications"), path: "specifications" },
              // { name: t("custom_fields"), path: "custom_fields" },
            ]}
            activeSection={activeSection}
          />
        </GridItem>
        <GridItem as="main">
          <form id="product-form" onSubmit={onSubmit}>
            <MainCreateProduct
              control={control}
              errors={errors}
              getValue={getValues}
              setValue={setValue}
              images={productImages}
              setImages={setProductImages}
              watch={watch}
              refs={refs}
            />
            <Price
              shopPrices={formValues.shop_prices}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              refs={refs}
            />
            <Remains
              measurementValues={formValues.measurement_values}
              control={control}
              errors={errors}
              getValues={getValues}
              refs={refs}
            />
            {/* <OptionsCreateProduct /> 
            <SpecificationsCreateProduct
              control={control}
              errors={errors}
              setValue={setValue}
            />
            {/* <CustomFieldsCreateProduct /> */}
          </form>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default CreateProductTemplate;
