import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flex, Tr, Td, Image, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import DeleteModal from "@/components/molecules/DeleteModal";
import useToast from "@/hooks/useToast";
import DeleteIcon from "@/assets/icons/delete.svg";
import EditIcon from "@/assets/icons/edit.svg";
import DownIcon from "@/assets/icons/down.svg";
import { deleteCategory } from "@/services";
import CreateCategory from "./CreateCategory";
import { tableStyles } from "./data";

function CategoryRow({ category }) {
  const [showChildren, setShowChildren] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate, isLoading } = useMutation(deleteCategory, {
    onSuccess: () => {
      addToast({
        title: `${t("category")} ${t("deleted_successfully")}`,
        status: "success",
      });
      queryClient.invalidateQueries(["categories"]);
      queryClient.removeQueries(["categories", category.id]);
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  return (
    <>
      <Tr key={category.id} borderBottom="1px solid grey.300">
        <Td
          {...tableStyles.td}
          cursor="pointer"
          onClick={() => setShowChildren(!showChildren)}
          userSelect="none"
        >
          {category.name}{" "}
          <Image
            marginLeft="8px"
            width="14px"
            src={DownIcon}
            display="inline"
            alt=""
            transition="all 0.3s ease"
            transform={
              showChildren ? "rotate(0deg) translateX(2px)" : "rotate(-90deg)"
            }
          />
        </Td>
        <Td {...tableStyles.td}>{category.number_of_products}</Td>
        <Td {...tableStyles.td}>
          <Flex alignItems="center" gap="15px">
            <Image
              width="24px"
              src={EditIcon}
              alt="Edit"
              onClick={() => setEditCategory(true)}
              cursor="pointer"
            />
            {editCategory && (
              <CreateCategory
                isOpen={editCategory}
                onClose={() => setEditCategory(false)}
                categoryData={category}
              />
            )}
            <Image
              aria-hidden
              width="24px"
              src={DeleteIcon}
              alt="Delete"
              cursor="pointer"
              onClick={onOpen}
            />
            {isOpen && (
              <DeleteModal
                isOpen={isOpen}
                onClose={onClose}
                title={t("are_you_sure_want_to_delete")}
                description={t("you_cant_restore_after_delete")}
                onDelete={async () => {
                  return new Promise((resolve) => {
                    mutate(category.id, { onSuccess: resolve });
                  });
                }}
                isDeleting={isLoading}
              />
            )}
          </Flex>
        </Td>
      </Tr>
      {showChildren &&
        category.children?.map((child) => (
          <Subcategory key={child.id} child={child} />
        ))}
    </>
  );
}

export default CategoryRow;

function Subcategory({ child }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const { mutate, isLoading } = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      queryClient.removeQueries(["categories", child.id]);
      addToast({
        title: `${t("category")} ${t("edited_successfully")}`,
        status: "success",
      });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  return (
    <Tr key={child.id}>
      <Td paddingLeft="50px !important" {...tableStyles.td}>
        {child.name}
      </Td>
      <Td {...tableStyles.td}>{child.number_of_products}</Td>
      <Td {...tableStyles.td}>
        <Flex alignItems="center" gap="15px">
          <Image width="24px" src={EditIcon} alt="Edit" visibility="hidden" />
          <Image
            aria-hidden
            width="24px"
            src={DeleteIcon}
            alt="Delete"
            cursor="pointer"
            onClick={onOpen}
          />
          {isOpen && (
            <DeleteModal
              isOpen={isOpen}
              onDelete={async () => {
                return new Promise((resolve) => {
                  mutate(child.id, { onSuccess: resolve });
                });
              }}
              onClose={onClose}
              isDeleting={isLoading}
              title={t("are_you_sure_want_to_delete")}
              description={t("are_you_sure_want_to_delete")}
            />
          )}
        </Flex>
      </Td>
    </Tr>
  );
}

CategoryRow.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number_of_products: PropTypes.number,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        number_of_products: PropTypes.number,
      }),
    ),
  }).isRequired,
};

Subcategory.propTypes = {
  child: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number_of_products: PropTypes.number,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        number_of_products: PropTypes.number,
      }),
    ),
  }).isRequired,
};
