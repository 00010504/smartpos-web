import { useReducer, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import GoBack from "@/components/molecules/GoBack";
import { createPriceTag, getPriceTag, updatePriceTag } from "@/services";
import useToast from "@/hooks/useToast";
import Layers from "./Layers";
import { mainTemplateCss as css, reducer, initialState, ACTIONS } from "./data";
import Parameters from "./Parameters";
import PriceTag from "./PriceTag";

function NewPriceTag() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { label_id } = useParams();
  const { t } = useTranslation();

  const parametersProps = {
    name: state.parameters.name,
    width: state.parameters.width,
    height: state.parameters.height,
    onChange: (value, field) => {
      dispatch({
        type: ACTIONS.CHANGE_PARAMETERS,
        payload: {
          name: field,
          value,
        },
      });
    },
    state,
  };

  const priceTagProps = {
    priceTagName: state.parameters.name,
    barcodeFormat: state.parameters.barcode_format,
    containerWidth: state.parameters.width,
    containerHeight: state.parameters.height,
    contents: state.content,
    selectedItem: {
      value: state.selectedItem,
      onChange: (layer) => {
        dispatch({
          type: ACTIONS.SET_SELECTED_ITEM,
          payload: {
            ...layer,
          },
        });
      },
    },
    changeResize: (e) => {
      dispatch({
        type: ACTIONS.RESIZE_ITEM,
        payload: {
          width: e.width,
          height: e.height,
        },
      });
    },
    changePosition: (position) => {
      dispatch({
        type: ACTIONS.CHANGE_POSITION,
        payload: position,
      });
    },
    styles: {
      value: state.selectedItem?.format,
      onChange: (payload) => {
        dispatch({
          type: ACTIONS.CHANGE_STYLES,
          payload,
        });
      },
    },
  };

  const layersProps = {
    contents: state.content,
    selectedItem: {
      value: state.selectedItem,
      onChange: (layer) => {
        dispatch({
          type: ACTIONS.SET_SELECTED_ITEM,
          payload: {
            ...layer,
          },
        });
      },
    },
    layers: state.layers,
    changeLayer: (layer_id, layer_name, layersOptions, image) => {
      console.log({
        type: ACTIONS.ADD_LAYER,
        payload: {
          id: layer_id,
          name: image
            ? "image"
            : layersOptions.find((option) => option.value === layer_id).label,
          type: layer_name,
          image,
        },
      });
      dispatch({
        type: ACTIONS.ADD_LAYER,
        payload: {
          id: image ? "image" : layer_id,
          name: image
            ? "image"
            : layersOptions.find((option) => option.value === layer_id).label,
          type: layer_name,
          image,
        },
      });
    },
    deleteLayer: (layer) => {
      dispatch({
        type: ACTIONS.DELETE_LAYER,
        payload: layer,
      });
    },
  };

  const mutation = () => {
    if (label_id) {
      return updatePriceTag.bind(null, label_id);
    }
    return createPriceTag;
  };

  const { mutate, isLoading } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["labels"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["labels", label_id],
        refetchType: "all",
      });
      addToast({
        title: label_id
          ? `${t("label")} ${t("edited_successfully")}`
          : `${t("label")} ${t("created_successfully")}`,
        status: "success",
      });
      navigate("/settings/labels");
    },
    onError: () => {
      addToast({
        title: t("label_creation_failed"),
        status: "error",
      });
    },
  });

  const onSubmit = () => {
    if (!state.content.length < 1 || !state.parameters.name) {
      addToast({
        title: t("at_least_one_layer_and_name"),
      });
      return;
    }
    mutate(state);
  };

  useEffect(() => {
    if (label_id) {
      getPriceTag(label_id).then((res) => {
        const layers = Object.keys(res.content).map((key) => {
          const layer = res.content[key];
          return {
            id: layer.field_name,
            name: layer.field_name,
            type: layer.type,
            image: layer.image,
          };
        });
        const payload = {
          ...res,
          layers,
        };
        dispatch({
          type: ACTIONS.SET_PRICE_TAG,
          payload,
        });
      });
    }
  }, [label_id]);

  const goBack = {
    title: label_id ? t("edit_label") : t("create_label"),
    modal: {
      title: t("are_you_use_stop_proccess"),
    },
    isDirty: true,
  };

  return (
    <Box p="0 3%">
      <GoBack {...goBack} />
      <SimpleGrid {...css.mainGrid}>
        <Layers {...layersProps} />
        <PriceTag {...priceTagProps} />
        <Parameters
          {...parametersProps}
          isLoading={isLoading}
          onSubmit={onSubmit}
          buttonName={label_id ? t("save") : t("create")}
        />
      </SimpleGrid>
    </Box>
  );
}

export default NewPriceTag;
