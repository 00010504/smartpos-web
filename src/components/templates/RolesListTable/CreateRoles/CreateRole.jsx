import { useState, useReducer, useEffect, createRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import FormNavigation from "@/components/molecules/FormNavigation";
import GoBack from "@/components/molecules/GoBack";
import useHookForm from "@/hooks/useHookForm";
import Input from "@/components/molecules/Input/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cloneDeep, range } from "lodash";
import useScrollSpy from "react-use-scrollspy";
import { useTranslation } from "react-i18next";
import { getRoleQuery, getModulesQuery } from "@/queries";
import { createRole, editRole } from "@/services";
import { useLangContext } from "@/contexts/langContext";
import useToast from "@/hooks/useToast";
import RoleRow from "./RoleRow";
import { reducer, schema, values, styles } from "./data";

function CreateRoles() {
  const { role_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [refs, setRefs] = useState([]);
  const { t } = useTranslation();
  const { lang } = useLangContext();

  const getQueryKeyAndFn = role_id
    ? getRoleQuery.bind(null, role_id)
    : getModulesQuery;

  const { data } = useQuery({
    ...getQueryKeyAndFn(),
  });

  const mutation = () => {
    if (role_id) {
      return editRole.bind(null, role_id);
    }
    return createRole;
  };

  const { mutate, isLoading } = useMutation(mutation(), {
    onSuccess: async () => {
      addToast({
        status: "success",
        title: role_id
          ? `${t("role")} ${t("edited_successfully")}`
          : `${t("role")} ${t("created_successfully")}`,
      });
      await queryClient.invalidateQueries({
        queryKey: ["roles"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["role", role_id],
        refetchType: "all",
      });
      navigate("/management/roles");
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  values.name = role_id ? data.name : "";

  const [modules, dispatchModules] = useReducer(
    reducer,
    cloneDeep(data.modules),
  );

  const currentHash = window.location.hash.slice(1) || "products";
  const currentHashIdx = modules.findIndex(
    (opt) => opt.name.toLowerCase().replace(" ", "-") === currentHash,
  );

  const activeSection = useScrollSpy({
    sectionElementRefs: refs,
    offsetPx: -250,
    activeSectionDefault: currentHashIdx !== -1 ? currentHashIdx : 0,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    setValue,
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit(({ name }, e) => {
    const permission_ids = Object.values(e.target).reduce((ids, field) => {
      // not great
      if (field.checked && field.name && field?.name?.length > 35) {
        return ids.concat(field.name);
      }
      return ids;
    }, []);

    mutate({
      name,
      permission_ids,
    });
  });

  useEffect(() => {
    range(data.modules.length).forEach(() =>
      setRefs((prev) => [...prev, createRef()]),
    );
  }, [data.modules.length, data.name, role_id, setValue]);

  return (
    <form
      onSubmit={onSubmit}
      style={{ padding: "20px 100px", marginTop: "3rem" }}
    >
      <GoBack
        isDirty={isDirty}
        backUrl="/management/roles/"
        title={role_id ? t("edit_role") : t("create_role")}
        rightElement={
          <Button
            isLoading={isSubmitting || isLoading}
            type="submit"
            color="#fff"
            height-="48px"
            w="100px"
          >
            {role_id ? t("save") : t("create")}
          </Button>
        }
        type="fixed"
      />
      <SimpleGrid gridTemplateColumns="200px auto" p="20px 30px" gap="100px">
        <Box>
          {modules.length && (
            <FormNavigation
              options={modules.map(({ name_translation }) => ({
                name: name_translation[lang],
                path: name_translation[lang].toLowerCase().replace(" ", "-"),
              }))}
              activeSection={activeSection}
            />
          )}
        </Box>
        <Box>
          <Input
            name="name"
            label={t("role_name")}
            control={control}
            errors={errors}
            inputProps={{
              placeholder: t("role_name"),
              ...styles.inputStyles,
            }}
          />
          {modules.map((module, i) => (
            <Box ref={refs[i]} key={module.id}>
              <RoleRow module={module} dispatchModules={dispatchModules} />
            </Box>
          ))}
        </Box>
      </SimpleGrid>
    </form>
  );
}

export default CreateRoles;
