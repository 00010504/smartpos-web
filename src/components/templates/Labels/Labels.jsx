import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { useTranslation } from "react-i18next";
import CustomTable from "@/components/organisms/CustomTable";
import useToast from "@/hooks/useToast";
import { getPricingTagsQuery } from "@/queries";
import { deletePriceTag } from "@/services";

const tableHeaders = [
  ["label", "80%"],
  ["actions", "20%"],
];

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

let params = {
  search: "",
  limit: "10",
  page: "1",
  ...parsed,
};

function PriceTags() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10",
  });
  const { t } = useTranslation();

  const { data: labels, isFetched } = useQuery({
    ...getPricingTagsQuery(params),
  });

  const { mutate } = useMutation(deletePriceTag, {
    onSuccess: (id) => {
      addToast({
        title: `${t("label")} ${t("deleted_successfully")}`,
        status: "success",
      });
      queryClient.invalidateQueries(["labels"]);
      queryClient.removeQueries(["labels", id]);
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const changePage = (page) => {
    params = { ...params, page: String(page) };
    setSearchParams(params);
  };

  const changeLimit = (e) => {
    const newPageSize = Number(e.target.value);
    params = { ...params, limit: newPageSize };
    setSearchParams(params);
  };

  const handleDelete = async (id) => {
    return new Promise((resolve) => {
      mutate(
        {
          ids: [id],
        },
        { onSuccess: resolve },
      );
    });
  };

  return (
    isFetched && (
      <CustomTable
        th={tableHeaders}
        td={labels?.data?.map((receipt) => ({
          id: receipt?.id,
          name: receipt?.parameters?.name || "No name",
        }))}
        onItemDelete={handleDelete}
        onItemEdit={(label_id) => navigate(`/settings/labels/edit/${label_id}`)}
        pagination={{
          total: labels?.total || 1,
          current: +searchParams.get("page"),
          onChange: changePage,
        }}
        pageSize={{
          value: +searchParams.get("limit"),
          onChange: changeLimit,
        }}
      />
    )
  );
}

export default PriceTags;
