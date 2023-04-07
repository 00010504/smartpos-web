import SingleQueryClient from "@/classes/SingleQueryClient";
import getDateRange from "@/helpers/getDateRange";
import {
  getUserPermissionsQuery,
  getRoleQuery,
  getModulesQuery,
  getRolesQuery,
  getProductsQuery,
  getShopsQuery,
  getProductQuery,
  getCategoriesQuery,
  getMeasurementUnitsQuery,
  getSupplierQuery,
  getClientsQuery,
  getClientQuery,
  getDashboardQuery,
  getSuppliersQuery,
  getEmployeesQuery,
  getEmployeeQuery,
  getAllOrdersQuery,
} from "@/queries";
import LocalStorage from "@/utils/LocalStorage";
import { lightFormat } from "date-fns";
// import { toast } from "@/utils/toast";
import qs from "qs";

const queryClient = SingleQueryClient.getInstance();

// promise.all might throw, check if the id exists before fetching

// root
export const rootLoader = async () => {
  const [allPermissions, userPermissions] = await Promise.all([
    modulesLoader(),
    permissionsLoader(),
  ]);

  return [allPermissions, userPermissions];

  async function permissionsLoader() {
    const _userPermissions = await getOrFetch(getUserPermissionsQuery);
    return _userPermissions;
  }
};

// dashboard
export const dashboardLoader = async ({ request }) => {
  const searchParams = request.url.split("?")[1] || {};
  const parsed = qs.parse(searchParams);

  let { date_from, date_to } = getDateRange("year");
  date_from = lightFormat(date_from, "dd-MM-yyyy 00:00:00");
  date_to = lightFormat(date_to, "dd-MM-yyyy 23:59:59");

  let shops = await getOrFetch(getShopsQuery);

  if (shops?.data?.length) {
    shops = shops?.data?.map((store) => store.id).join(",");
  }

  const params = {
    date_from,
    date_to,
    analytcs_filter_date_type: "year",
    shops,
    ...parsed,
  };

  const data = await getOrFetch(getDashboardQuery.bind(null, params));
  return [data, params];
};

// products/catalog
export const catalogLoader = async ({ request }) => {
  const searchParams = request.url.split("?")[1] || {};
  const parsed = qs.parse(searchParams);

  const params = {
    active_for_sale: "all",
    search: "",
    limit: String(LocalStorage?.products_table?.page_size || "10"),
    page: "1",
    ...parsed,
  };

  const catalog = await getOrFetch(getProductsQuery.bind(null, params));
  return catalog;
};

export const productLoader = async ({ params }) => {
  const product = await getOrFetch(getProductQuery, params.product_id);

  const [shops, categories, measurement_units] = await Promise.all([
    getOrFetch(getShopsQuery),
    getOrFetch(getCategoriesQuery),
    getOrFetch(getMeasurementUnitsQuery),
  ]);

  return [shops, categories, measurement_units, product];
};

// products/suppliers
export const suppliersLoader = async ({ request }) => {
  const searchParams = request.url.split("?")[1] || {};
  const parsed = qs.parse(searchParams);

  const params = {
    search: "",
    limit: "10",
    page: "1",
    ...parsed,
  };

  const suppliers = await getOrFetch(getSuppliersQuery.bind(null, params));
  return suppliers;
};

export const supplierLoader = async ({ params }) => {
  const supplier = await getOrFetch(getSupplierQuery, params.supplier_id);
  return supplier;
};

// sales/all-sales
export const salesLoader = async ({ request }) => {
  const searchParams = request.url.split("?")[1] || {};
  const parsed = qs.parse(searchParams);

  const params = {
    search: "",
    limit: "10",
    page: "1",
    client_ids: "",
    shop_ids: "",
    cashier_ids: "",
    min_amount: "",
    max_amount: "",
    ...parsed,
  };

  const sales = await getOrFetch(getAllOrdersQuery.bind(null, params));
  return sales;
};

// clients/list
export const clientsLoader = async ({ request }) => {
  const searchParams = request.url.split("?")[1] || {};
  const parsed = qs.parse(searchParams);

  const params = {
    search: "",
    limit: String(LocalStorage?.products_table?.page_size || "10"),
    page: "1",
    ...parsed,
  };

  const clients = await getOrFetch(getClientsQuery.bind(null, params));
  return clients;
};

export const clientLoader = async ({ params }) => {
  const client = await getOrFetch(getClientQuery, params.client_id);
  return client;
};

// management/roles
export const rolesLoader = async () => {
  const roles = await getOrFetch(getRolesQuery);
  return roles;
};

export const roleLoader = async ({ params }) => {
  const role = await getOrFetch(getRoleQuery, params.role_id);
  return role;
};

export const modulesLoader = async () => {
  const modules = await getOrFetch(getModulesQuery);
  return modules;
};

// management/employees
export const employeesLoader = async ({ request }) => {
  const searchParams = request.url.split("?")[1] || {};
  const parsed = qs.parse(searchParams);

  const params = {
    search: "",
    limit: "10",
    page: "1",
    ...parsed,
  };

  const employees = await getOrFetch(getEmployeesQuery.bind(null, params));
  return employees;
};

export const employeeLoader = async ({ params }) => {
  const employee = await getOrFetch(getEmployeeQuery, params.emp_id);
  return employee;
};

/**
 *
 * @param {function} queryGetter returns a react-query applicable query object
 * @param {string} entityId it is used only for requesting specific entities (with ids) from the server
 * @returns data fetched from API or cache
 * @info it has two signatures:
 * getOrFetch(queryGetter);
 * getOrFetch(queryGetterById, id);
 */

async function getOrFetch(queryGetter, entityId) {
  if (queryGetter.expectsId && !entityId) return null;

  let query,
    entity = null;

  if (queryGetter.expectsId && entityId) {
    query = queryGetter.call(null, entityId);
  }

  if (!queryGetter.expectsId) {
    query = queryGetter();
  }

  const cachedData = queryClient.getQueryData(query.queryKey);

  if (cachedData) {
    entity = cachedData;
  } else {
    try {
      entity = await queryClient.fetchQuery(query);
    } catch (err) {
      console.error(err);
    }
  }

  return entity;
}
