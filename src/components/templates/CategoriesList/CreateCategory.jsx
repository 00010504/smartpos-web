import { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Image,
} from "@chakra-ui/react";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Drawer from "@/components/molecules/Drawer";
import { createCategory, updateCategory } from "@/services";
import DeleteCategoryIcon from "@/assets/images/icons/delete-category.svg";
import BorderCategory from "@/assets/icons/border-category.svg";
import useToast from "@/hooks/useToast";
import { reducer, emptyState, createStyles } from "./data";

function CreateCategory({ onClose, isOpen, categoryData }) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(
    reducer,
    cloneDeep(categoryData) ?? emptyState,
  );

  const mutation = () => {
    if (categoryData?.id) {
      return updateCategory.bind(null, categoryData?.id);
    }
    return createCategory;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", categoryData?.id],
        refetchType: "all",
      });
      if (categoryData?.id) {
        addToast({
          title: `${t("category")} ${t("edited_successfully")}`,
          status: "success",
        });
      } else {
        addToast({
          title: `${t("category")} ${t("created_successfully")}`,
          status: "success",
        });
      }
      onClose();
      dispatch({ type: "clear" });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      if (state.draft) {
        if (state.name.length <= 0) {
          dispatch({ type: "top", payload: state.draft });
        } else {
          dispatch({ type: "child", payload: state.draft });
        }
      }
    },
    [state.draft, state.name],
  );

  const handleSubmit = useCallback(() => {
    const newState = cloneDeep(state);

    if (
      !categoryData?.id &&
      state.draft.length > 0 &&
      state.draft[state.draft.length - 1].name !== state.draft
    ) {
      newState.children[newState.children.length] = { name: state.draft };
    }

    mutate(newState);
  }, [categoryData, state, mutate]);

  return (
    <Drawer
      size="sm"
      Header={<Heading size="lg">{t("new_category")}</Heading>}
      Body={
        <form onSubmit={handleAdd}>
          <FormControl mt={5}>
            <FormLabel mb="15px">{t("category_name")}</FormLabel>
            <Box position="relative" mt={5}>
              <Input
                value={state.name ? state.name : state.draft}
                placeholder={t("enter_category_name")}
                autoComplete="off"
                onChange={(e) => {
                  if (!state.name) {
                    dispatch({ type: "draft", payload: e.target.value });
                  } else {
                    dispatch({ type: "top", payload: e.target.value });
                  }
                }}
                {...createStyles.input}
              />
              {state.name && (
                <Box {...createStyles.rightElement}>
                  <Image
                    src={DeleteCategoryIcon}
                    alt=""
                    cursor="pointer"
                    onClick={() => {
                      dispatch({ type: "clear", payload: emptyState });
                    }}
                  />
                </Box>
              )}
            </Box>
          </FormControl>
          {state.name && (
            <Box pl="25px">
              {state.children?.map((child, index) => (
                <Box
                  position="relative"
                  mt={5}
                  key={child.id ? child.id : index}
                >
                  <Input
                    {...createStyles.input}
                    value={child.name}
                    onChange={(e) => {
                      dispatch({
                        type: "changeValue",
                        payload: {
                          id: index,
                          value: e.target.value,
                        },
                      });
                    }}
                  />
                  <Image
                    src={BorderCategory}
                    alt=""
                    position="absolute"
                    left="-40px"
                    top="-50%"
                  />
                  <Box {...createStyles.rightElement}>
                    <Image
                      src={DeleteCategoryIcon}
                      alt=""
                      cursor="pointer"
                      onClick={() =>
                        dispatch({ type: "delete", payload: index })
                      }
                    />
                  </Box>
                </Box>
              ))}
              <Input
                placeholder={t("enter_subcategory_name")}
                mt={5}
                value={state.draft || ""}
                onChange={(e) => {
                  dispatch({
                    type: "draft",
                    payload: e.target.value,
                  });
                }}
                {...createStyles.input}
              />
            </Box>
          )}
          <Button {...createStyles.buttonStyles} type="submit">
            {state.name ? t("add_subcategory") : t("add_category")}
          </Button>
        </form>
      }
      Footer={
        <Button
          width="100%"
          height="50px"
          bg={state.name ? "#256DF6" : "colors.icon"}
          isDisabled={state.name === "" || state.name === null}
          onClick={handleSubmit}
          color="#fff"
        >
          {t("create")}
        </Button>
      }
      isOpen={isOpen}
      onClose={() => {
        dispatch({ type: "clear" });
        onClose();
      }}
    />
  );
}

export default CreateCategory;

CreateCategory.defaultProps = {
  categoryData: null,
};

CreateCategory.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  categoryData: PropTypes.shape({
    name: PropTypes.string,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    id: PropTypes.string,
  }),
};
