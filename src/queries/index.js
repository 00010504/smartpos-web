import {
  getRoles,
  getRole,
  getModules,
  getCategories,
  getProducts,
  getProduct,
  getShops,
  getCashboxList,
  getProfile,
  defaultShift,
  getAllOrder,
  getCashbox,
  getOrder,
  getReceipts,
  getEmployees,
  getCompany,
  getImports,
  getLayers,
  getMeasurementUnits,
  getPriceTags,
  getSuppliers,
  getSupplier,
  getSupplierOrders,
  getClients,
  getClient,
  getDashboardData,
  getSupplierOrder,
  getEmployee,
  getUserPermissions,
  getSingleReceipt,
} from "@/services";
import { getScalesTemplates } from "@/services/scales-template";

// root
export function getUserPermissionsQuery() {
  return {
    queryKey: ["permissions"],
    queryFn: async () => getUserPermissions(),
  };
}

// dashboard
export function getDashboardQuery(params) {
  return {
    queryKey: ["dashboard", params],
    queryFn: async () => getDashboardData(params),
  };
}

// products/catalog
export function getProductsQuery(params) {
  return {
    queryKey: ["products", params],
    queryFn: async () => getProducts(params),
  };
}

export function getProductQuery(id) {
  return {
    queryKey: ["product", id],
    queryFn: async () => getProduct(id),
  };
}

getProductQuery.expectsId = true;

export function getShopsQuery() {
  return {
    queryKey: ["shops"],
    queryFn: async () => getShops(),
  };
}

export function getMeasurementUnitsQuery() {
  return {
    queryKey: ["measurement_units"],
    queryFn: async () => getMeasurementUnits(),
  };
}

export function getTemplatesQuery() {
  return {
    queryKey: ["scale-templates"],
    queryFn: () => getScalesTemplates(),
  };
}

// products/categories
export function getCategoriesQuery() {
  return {
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
  };
}

// products/import
export function getImportQuery(params) {
  return {
    queryKey: ["imports", params],
    queryFn: async () => getImports(params),
  };
}

// products/import/create-tag
export function getLayersQuery() {
  return {
    queryKey: ["layers"],
    queryFn: async () => getLayers(),
  };
}

// products/suppliers
export function getSuppliersQuery(params) {
  return {
    queryKey: ["suppliers", params],
    queryFn: async () => getSuppliers(params),
  };
}

// products/suppliers
export function getSupplierQuery(id) {
  return {
    queryKey: ["supplier", id],
    queryFn: async () => getSupplier(id),
  };
}

getSupplierQuery.expectsId = true;

// products/orders
export function getSupplierOrderQuery(params) {
  return {
    queryKey: ["supplier-orders", params],
    queryFn: async () => getSupplierOrders(params),
  };
}

// sales/create
export function getSaleProductsQuery(params) {
  return {
    queryKey: ["sale-products", params],
    queryFn: async () => getSupplierOrders(params),
  };
}

// sales/sale
export function getOrderQuery(id) {
  return {
    queryKey: ["order", id],
    queryFn: async () => getOrder(id),
  };
}

getOrderQuery.expectsId = true;

// sales/sale
export function getDefaultShiftQuery() {
  return {
    queryKey: ["defaultShift"],
    queryFn: async () => defaultShift(),
  };
}

// sales/new-sale
export function getCashboxQuery(id) {
  return {
    queryKey: ["cashbox", id],
    queryFn: async () => getCashbox(id),
  };
}

getCashboxQuery.expectsId = true;

// sales/all-sales
export function getAllOrdersQuery(params) {
  return {
    queryKey: ["sales", params],
    queryFn: async () => getAllOrder(params),
  };
}

// clients
export function getClientsQuery(params) {
  return {
    queryKey: ["clients", params],
    queryFn: async () => getClients(params),
  };
}

export function getClientQuery(id) {
  return {
    queryKey: ["client", id],
    queryFn: async () => getClient(id),
  };
}

getClientQuery.expectsId = true;

// managament/employees
export function getEmployeesQuery(params) {
  return {
    queryKey: ["employees", params],
    queryFn: async () => getEmployees(params),
  };
}

// management/employees/edit/:emp_id
export function getEmployeeQuery(id) {
  return {
    queryKey: ["employee", id],
    queryFn: async () => getEmployee(id),
  };
}

getEmployeeQuery.expectsId = true;

// management/roles
export function getRolesQuery() {
  return {
    queryKey: ["roles"],
    queryFn: async () => getRoles(),
  };
}

// management/roles/role/:role_id
export function getRoleQuery(id) {
  return {
    queryKey: ["role", id],
    queryFn: async () => getRole(id),
  };
}

getRoleQuery.expectsId = true;

// management/roles/create
export function getModulesQuery() {
  return {
    queryKey: ["modules"],
    queryFn: async () => getModules(),
  };
}

// settings/price-tags
export function getPricingTagsQuery(params) {
  return {
    queryKey: ["labels", params],
    queryFn: async () => getPriceTags(params),
  };
}

// settings/stores
export function getStoresQuery(params) {
  return {
    queryKey: ["stores", params],
    queryFn: async () => getShops(params),
  };
}

// settings/cashboxes
export function getCashboxesQuery(params) {
  return {
    queryKey: ["cashboxes", params],
    queryFn: async () => getCashboxList(params),
  };
}

// settings/receipts
export function getReceiptsQuery(params) {
  return {
    queryKey: ["receipts", params],
    queryFn: async () => getReceipts(params),
  };
}

// settings/profile
export function getProfileQuery() {
  return {
    queryKey: ["profile"],
    queryFn: async () => getProfile(),
  };
}

// settings/company
export function getCompanyQuery() {
  return {
    queryKey: ["company"],
    queryFn: async () => getCompany(),
  };
}

// products/supplier-order
export function getSupplierOrderByIdQuery(id) {
  return {
    queryKey: ["supplier-order", id],
    queryFn: async () => getSupplierOrder(id),
  };
}

// receipts/create-receipt
export function getReceiptQuery(id) {
  return {
    queryKey: ["receipt", id],
    queryFn: async () => getSingleReceipt(id),
  };
}

getSupplierOrderByIdQuery.expectsId = true;
