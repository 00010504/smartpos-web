import { useEffect, useReducer, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Fade, Grid } from "@chakra-ui/react";
import GoBack from "@/components/molecules/GoBack";
import {
  getReceiptBlocks,
  createCheque,
  getSingleReceipt,
  updateCheque,
} from "@/services";
import useToast from "@/hooks/useToast";
import sendImage from "@/helpers/uploadImage";
import Parameters from "./Parameters";
import Blocks from "./Blocks";
import { initialState, reducer, ACTIONS } from "./data";
import Receipt from "./Receipt";
/* eslint-disable react-hooks/exhaustive-deps */

export default function CreateReceiptTemplate() {
  const [getReceiptLoading, setReceiptLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { receipt_id } = useParams();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = () => {
    if (receipt_id) {
      return updateCheque.bind(null, receipt_id);
    }
    return createCheque;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["receipts"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["receipt", receipt_id],
        refetchType: "all",
      });
      addToast({
        title: receipt_id
          ? `${t("receipt")} ${t("edited_successfully")}`
          : `${t("receipt")} ${t("edited_successfully")}`,
        status: "success",
      });
      navigate("/settings/receipt");
    },
    onError: () => {
      addToast({ title: t("already_exists_with_this_name") });
      setIsLoading(false);
    },
  });

  const onSubmit = () => {
    const payload = state;

    payload.field_ids = state.blocks.map((block) => {
      return block.fields.map((field, i) => {
        return {
          ...field,
          field_id: field.id,
          position: i + 1,
        };
      });
    });

    payload.field_ids = payload.field_ids.flat();

    const activeFields = payload.field_ids.filter((field) => field.is_added);

    // payload.field_ids = payload.field_ids.filter((field) => field.is_added);

    if (state.name.length === 0 || activeFields.length === 0) {
      setIsLoading(false);
      return addToast({
        title: t("name_and_at_least_one_block_are_required"),
      });
    }
    setIsLoading(true);
    mutate(payload);
    return receipt_id;
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const fieldsRepositionHandle = (res) => {
    if (!res.destination) return;
    // block and field ids
    const ids = res.draggableId.split("*");

    const fields = reorder(
      state.blocks.filter((block) => block.id === ids[0])[0].fields,
      res.source.index,
      res.destination.index,
    );

    dispatch({
      type: ACTIONS.REPOSITION_FIELD,
      payload: {
        blockId: ids[0],
        fields,
      },
    });
  };

  const parametersProps = useMemo(() => {
    return {
      isLoading,
      onSubmit,
      state,
      buttonName: receipt_id ? t("save") : t("create"),
      onChange: (value, field) => {
        dispatch({
          type: ACTIONS.CHANGE_TEXT_FIELD,
          payload: {
            name: field,
            value,
          },
        });
      },
    };
  }, [state, isLoading]);

  const blocksProps = useMemo(() => {
    return {
      state,
      onCheckBlock: (id) => {
        dispatch({
          type: ACTIONS.CHECK_BLOCK,
          payload: id,
        });
      },
      onCheckField: (blockId, fieldId) => {
        dispatch({
          type: ACTIONS.CHECK_FIELD,
          payload: {
            blockId,
            fieldId,
          },
        });
      },
      onAllCheckboxToogle: (blockId, value) => {
        dispatch({
          type: ACTIONS.ALL_CHECKBOX_TOOGLE,
          payload: {
            blockId,
            value,
          },
        });
      },
      onRepositionField: fieldsRepositionHandle,
    };
  }, [state]);

  const receiptProps = useMemo(() => {
    return {
      state,
      setImage: (options) =>
        dispatch({
          type: ACTIONS.CHANGE_TEXT_FIELD,
          payload: {
            name: "logo",
            value: {
              ...(state.logo || {}),
              ...options,
            },
          },
        }),
      previewImage: (url) =>
        dispatch({
          type: ACTIONS.IMAGE_PREVIEW,
          payload: url,
        }),
    };
  }, [state]);

  useEffect(() => {
    if (!receipt_id) {
      getReceiptBlocks().then((res) => {
        const payload = res.blocks?.map((block) => ({
          ...block,
          is_active: true,
        }));
        dispatch({
          type: ACTIONS.SET_BLOCKS,
          payload,
        });
      });
    }
  }, [receipt_id]);

  useEffect(() => {
    if (state.image_preview) {
      (async () => {
        const res = await sendImage(state.image_preview);
        dispatch({
          type: ACTIONS.CHANGE_TEXT_FIELD,
          payload: {
            name: "logo",
            value: {
              ...state.logo,
              image: res.file_url,
              right: 260,
              bottom: 110,
            },
          },
        });
        dispatch({
          type: ACTIONS.CHANGE_TEXT_FIELD,
          payload: {
            name: "image_preview",
            value: "",
          },
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  console.log(state);

  useEffect(() => {
    if (receipt_id) {
      setReceiptLoading(true);
      getSingleReceipt(receipt_id)
        .then((res) => {
          const payload = {
            ...res,
            logo: res.logo || {
              image: "",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            },
          };
          dispatch({
            type: ACTIONS.SET_DATA,
            payload,
          });
        })
        .finally(() => setReceiptLoading(false));
    }
  }, [receipt_id]);

  return (
    <Box px="4%">
      <GoBack
        title={receipt_id ? t("edit_receipt") : t("new_receipt")}
        backUrl="/settings/receipt"
      />
      {!getReceiptLoading && (
        <Fade in>
          <Grid gridTemplateColumns="1fr 2fr 1fr" mt="20px" gap="24px">
            <Blocks {...blocksProps} />
            <Receipt {...receiptProps} />
            <Parameters {...parametersProps} />
          </Grid>
        </Fade>
      )}
    </Box>
  );
}
