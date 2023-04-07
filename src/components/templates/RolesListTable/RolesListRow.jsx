import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "@/services";
import { Flex, Tr, Td, Image, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DeleteModal from "@/components/molecules/DeleteModal";
import DeleteIcon from "@/assets/icons/delete.svg";
import EditIcon from "@/assets/icons/edit.svg";
import useToast from "@/hooks/useToast";
import PropTypes from "prop-types";
import { tableStyles } from "./data";

function RolesListRow({ role }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(deleteRole, {
    onSuccess: () => {
      addToast({
        status: "success",
        title: `${t("role")} ${t("deleted_successfully")}`,
      });
      queryClient.invalidateQueries(["roles"]);
      queryClient.removeQueries(["role", role.id]);
    },

    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  return (
    <Tr key={role.name}>
      <Td {...tableStyles.td}>{role.name}</Td>
      <Td
        color="brand.500"
        fontWeight={700}
        borderBottom="none"
      >{`${role.created_by.first_name} ${role.created_by.last_name}`}</Td>
      <Td {...tableStyles.td}>
        {role.is_deletable && (
          <Flex alignItems="center" gap="15px">
            <Image
              cursor="pointer"
              width="25px"
              src={EditIcon}
              alt="Edit"
              onClick={() => navigate(`/management/roles/role/${role.id}`)}
            />
            <Image
              cursor="pointer"
              width="25px"
              src={DeleteIcon}
              alt="Delete"
              onClick={onOpen}
            />
            <DeleteModal
              isOpen={isOpen}
              onClose={onClose}
              onDelete={async () => {
                return new Promise((resolve) => {
                  mutate(role.id, { onSuccess: resolve });
                });
              }}
              isDeleting={isLoading}
              title={t("are_you_sure_want_to_delete")}
              description={t("you_cant_restore_after_delete")}
            />
          </Flex>
        )}
      </Td>
    </Tr>
  );
}

export default RolesListRow;

RolesListRow.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    created_by: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    }).isRequired,
    is_deletable: PropTypes.bool.isRequired,
  }).isRequired,
};
