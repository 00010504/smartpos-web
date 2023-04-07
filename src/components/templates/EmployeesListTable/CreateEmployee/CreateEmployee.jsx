import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useHookForm from "@/hooks/useHookForm";
import useToast from "@/hooks/useToast";
import {
  createEmployee,
  getEmployee,
  getUserByPhone,
  updateEmployee,
} from "@/services";
import GoBack from "@/components/molecules/GoBack";
import Profile from "./Profile";
import StoreRoles from "./StoreRoles";
import { schema, values, employeeStatus } from "./data";

function CreateEmployee() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { emp_id } = useParams();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useHookForm(values, schema);

  const mutation = () => {
    if (emp_id) {
      return updateEmployee.bind(null, emp_id);
    }
    return createEmployee;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["employee", emp_id],
        refetchType: "all",
      });
      addToast({
        title: emp_id
          ? `${t("employee")} ${t("edited_successfully")}`
          : `${t("employee")} ${t("created_successfully")}`,
        status: "success",
      });
      navigate("/management/employees");
    },
    onError: (error) => {
      addToast({ title: error.data.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    const modifiedData = {
      ...data,
      role_id: data.role_id.value,
      shop_id: data.shop_id[0].value,
      shop_ids: data.shop_id.map((shop) => shop.value),
      status_id: data.status.value,
      status: data.status.value,
      password: data.new_password,
    };

    getUserByPhone({ phone_number: watch("phone_number") });

    mutate(modifiedData);

    // createEmployee(modifiedData)
    //   .then(() => {
    //     addToast({
    //       status: "success",
    //       title: `${t("employee")} ${t("created_successfully")}`,
    //     });
    //     queryClient.invalidateQueries(["employees"]);
    //     navigate("/management/employees");
    //   })
    //   .catch(() => {
    //     addToast({
    //       title: "Error while creating employee",
    //     });
    //   });
  });

  useEffect(() => {
    if (emp_id) {
      getEmployee(emp_id).then((res) => {
        const modifiedData = {
          first_name: res.user.first_name,
          last_name: res.user.last_name,
          phone_number: res.user.phone_number,
          role_id: { value: res.role.id, label: res.role.name },
          status: {
            value: employeeStatus.find((item) => item.value === res.status.id)
              .value,
            label: employeeStatus.find((item) => item.value === res.status.id)
              .label,
          },
          shop_id: res.shops.map((shop) => ({
            value: shop.id,
            label: shop.name,
          })),
          new_password: "test123",
          confirm_password: "test123",
        };
        reset(modifiedData);
      });
    }
  }, [emp_id, reset]);

  console.log(watch());

  return (
    <form onSubmit={onSubmit}>
      <GoBack
        type="sticky"
        title={emp_id ? `${t("edit")} ${t("employee")}` : t("create_employee")}
        rightElement={
          <Button colorScheme="gray" color="brand.500" type="submit">
            {emp_id ? t("edit") : t("create")}
          </Button>
        }
      />
      <Box mt={3}>
        <Profile control={control} errors={errors} id={emp_id} />
        <StoreRoles control={control} errors={errors} />
      </Box>
    </form>
  );
}

export default CreateEmployee;
