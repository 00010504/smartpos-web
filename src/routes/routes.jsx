import { Outlet } from "react-router-dom";
import {
  rootLoader,
  rolesLoader,
  modulesLoader,
  roleLoader,
  catalogLoader,
  productLoader,
  supplierLoader,
  clientsLoader,
  clientLoader,
  dashboardLoader,
  suppliersLoader,
  employeesLoader,
  employeeLoader,
  salesLoader,
} from "@/routes/loaders";
import lazyWithRetry from "@/helpers/lazyWithRetry";

// Error components
// import ErrorBoundary from "@/errors/ErrorBoundary";
import ErrorMessage from "@/errors/ErrorMessage";

// Sidebar icons
const ProductsIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Products"),
);
const SalesIcon = lazyWithRetry(() => import("@/components/atoms/Icons/Sales"));
const ClientsIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Clients"),
);
const EcommerceIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Ecommerce"),
);
const MarketingIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Marketing"),
);
const ReportsIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Reports"),
);
const ManagementIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Management"),
);
const FinanceIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Finance"),
);
const SettingsIcon = lazyWithRetry(() =>
  import("@/components/atoms/Icons/Settings"),
);

// Main
const Root = lazyWithRetry(() => import("@/views/Root"));
const Dashboard = lazyWithRetry(() => import("@/views/Dashboard/Dashboard"));

// Auth pages
const Auth = lazyWithRetry(() => import("@/views/Auth"));
const AuthComponent = lazyWithRetry(() =>
  import("@/components/templates/AuthComponent/AuthComponent"),
);
const CreateAccount = lazyWithRetry(() => import("@/views/CreateAccount"));

// Product pages
const Catalog = lazyWithRetry(() => import("@/views/products/Products"));
const Orders = lazyWithRetry(() => import("@/views/products/SupplierOrder"));
const CreateProduct = lazyWithRetry(() =>
  import("@/views/products/CreateProduct"),
);
const ImportList = lazyWithRetry(() => import("@/views/products/Import"));
const CategoriesList = lazyWithRetry(() =>
  import("@/views/products/Categories"),
);
const ImportValidation = lazyWithRetry(() =>
  import("@/views/products/ImportValidation"),
);
const ImportPreview = lazyWithRetry(() =>
  import("@/views/products/ImportPreview"),
);
const CreateLabel = lazyWithRetry(() => import("@/views/products/CreateLabel"));
const Suppliers = lazyWithRetry(() => import("@/views/products/Suppliers"));
const CreateSupplier = lazyWithRetry(() =>
  import("@/views/products/CreateSupplier/CreateSupplier"),
);
const CreateOrder = lazyWithRetry(() =>
  import("@/views/products/CreateOrer/CreateOrder"),
);
const CreateSupplierOrderItems = lazyWithRetry(() =>
  import("@/components/templates/SupplierOrders/CreateSupplierOrderItems"),
);
const ReceiveSupplierOrder = lazyWithRetry(() =>
  import("@/components/templates/SupplierOrders/ReceiveSupplierOrder"),
);
const ClientsList = lazyWithRetry(() => import("@/views/Clients/ClientsList"));
const CreateClient = lazyWithRetry(() =>
  import("@/views/Clients/CreateClient"),
);
const NotFound = lazyWithRetry(() => import("@/components/templates/NotFound"));

// Managament pages
const EmployeesList = lazyWithRetry(() =>
  import("@/views/managament/Employees"),
);
const RolesList = lazyWithRetry(() => import("@/views/managament/Roles"));
const EmployeesCreate = lazyWithRetry(() =>
  import(
    "@/components/templates/EmployeesListTable/CreateEmployee/CreateEmployee"
  ),
);
const CreateRoles = lazyWithRetry(() =>
  import("@/components/templates/RolesListTable/CreateRoles/CreateRole"),
);

// Sales pages
const NewSale = lazyWithRetry(() => import("@/views/Sales/NewSale"));
const AllSales = lazyWithRetry(() => import("@/views/Sales/AllSales"));
const SalesPayment = lazyWithRetry(() =>
  import("@/components/templates/SalesTemplates/SalesPayment/SalesPayment"),
);

// Settings pages
const ProfileSettings = lazyWithRetry(() =>
  import("@/views/Settings/ProfileSettings"),
);
const CashboxSettings = lazyWithRetry(() =>
  import("@/views/Settings/CashboxSettings"),
);
const CompanySettings = lazyWithRetry(() =>
  import("@/views/Settings/CompanySettings"),
);
const CreateCashbox = lazyWithRetry(() =>
  import("@/views/Settings/CreateCashbox"),
);
const ProductSettings = lazyWithRetry(() =>
  import("@/views/Settings/ProductSettings"),
);
const ReceiptSettings = lazyWithRetry(() =>
  import("@/views/Settings/ReceiptSettings"),
);
const CreateReceipt = lazyWithRetry(() =>
  import("@/views/Settings/CreateReceipt"),
);
const StoreSettings = lazyWithRetry(() =>
  import("@/views/Settings/StoreSettings"),
);
const CreateStore = lazyWithRetry(() => import("@/views/Settings/CreateStore"));
const Labels = lazyWithRetry(() => import("@/views/Settings/Labels"));

// Excel upload check page
const ImportCheck = lazyWithRetry(() => import("@/views/products/ImportCheck"));

const routes = [
  {
    id: "root",
    title: "Smart POS",
    path: "/",
    element: <Root getRoutes={() => routes} />,
    loader: rootLoader,
    errorElement: <ErrorMessage />,
    children: [
      {
        id: "dashboard",
        title: "dashboard",
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        id: "products",
        title: "products",
        Icon: ProductsIcon,
        path: "products",
        element: <Outlet />,
        children: [
          {
            id: "catalog",
            title: "catalog",
            path: "catalog",
            element: <Catalog />,
            loader: catalogLoader,
            children: [
              {
                id: "create-product",
                title: "Create product",
                path: "create-product",
                element: <CreateProduct />,
                loader: productLoader,
              },
              {
                id: "edit-product",
                title: "Edit product",
                path: "edit/:product_id",
                element: <CreateProduct />,
                loader: productLoader,
              },
            ],
          },
          {
            id: "import",
            title: "import",
            path: "import",
            element: <ImportList />,
            children: [
              {
                id: "import-check",
                title: "Import check",
                path: "check/:file_uid",
                element: <ImportCheck />,
              },
              {
                id: "import-validation",
                title: "Import validation",
                path: "validation/:file_uid",
                element: <ImportValidation />,
              },
              {
                id: "import-preview",
                title: "Import preview",
                path: "preview/:file_uid",
                element: <ImportPreview />,
                children: [
                  {
                    id: "import-preview-view",
                    title: "Import preview view",
                    path: "view-only",
                    element: <ImportPreview />,
                  },
                ],
              },
            ],
          },
          {
            id: "transfer",
            title: "transfer",
            path: "transfer",
            element: <div>transfer</div>,
          },
          {
            id: "orders",
            title: "orders",
            path: "orders",
            element: <Orders />,
            children: [
              {
                id: "create-order",
                title: "Create order",
                path: "create-order",
                element: <CreateOrder />,
              },
              {
                id: "edit-order",
                title: "Edit order",
                path: "edit-order/:supplier_order_id",
                element: <CreateSupplierOrderItems />,
              },
              {
                id: "receive-order",
                title: "Receive order",
                path: "receive-order/:supplier_order_id",
                element: <ReceiveSupplierOrder />,
              },
            ],
          },
          {
            id: "suppliers",
            title: "suppliers",
            path: "suppliers",
            element: <Suppliers />,
            loader: suppliersLoader,
            children: [
              {
                id: "create-supplier",
                title: "Create Supplier",
                path: "create-supplier",
                element: <CreateSupplier />,
                loader: supplierLoader,
              },
              {
                id: "edit-supplier",
                title: "Edit Supplier",
                path: "edit/:supplier_id",
                element: <CreateSupplier />,
                loader: supplierLoader,
              },
            ],
          },
          {
            id: "categories",
            title: "categories",
            path: "categories",
            element: <CategoriesList />,
          },
        ],
      },
      {
        id: "sales",
        title: "sales",
        Icon: SalesIcon,
        path: "sales",
        element: <Outlet />,
        children: [
          {
            id: "all-sales",
            title: "all_sales",
            path: "all-sales",
            element: <AllSales />,
            loader: salesLoader,
          },
          {
            id: "new-sale",
            title: "new_sale",
            path: "new-sale",
            element: <NewSale />,
            children: [
              {
                id: "payment",
                title: "Payment",
                path: "payment",
                element: <SalesPayment />,
              },
            ],
          },
        ],
      },
      {
        id: "clients",
        title: "clients",
        Icon: ClientsIcon,
        path: "clients",
        element: <Outlet />,
        children: [
          {
            id: "all-clients",
            title: "clients",
            path: "list",
            element: <ClientsList />,
            loader: clientsLoader,
            children: [
              {
                id: "create-client",
                title: "Create client",
                path: "create-client",
                element: <CreateClient />,
                loader: clientLoader,
              },
              {
                id: "edit-client",
                title: "Edit client",
                path: "edit-client/:client_id",
                element: <CreateClient />,
                loader: clientLoader,
              },
            ],
          },
        ],
      },
      {
        id: "ecommerce",
        title: "ecommerce",
        Icon: EcommerceIcon,
        path: "ecommerce",
        element: <Outlet />,
        children: [],
      },
      {
        id: "marketing",
        title: "marketing",
        Icon: MarketingIcon,
        path: "marketing",
        element: <Outlet />,
        children: [],
      },
      {
        id: "reports",
        title: "reports",
        Icon: ReportsIcon,
        path: "reports",
        element: <Outlet />,
        children: [],
      },
      {
        id: "management",
        title: "management",
        Icon: ManagementIcon,
        path: "management",
        element: <Outlet />,
        children: [
          {
            id: "employees",
            title: "employees",
            path: "employees",
            element: <EmployeesList />,
            loader: employeesLoader,
            children: [
              {
                id: "create-employee",
                title: "Create employee",
                path: "create-employee",
                element: <EmployeesCreate />,
                loader: employeeLoader,
              },
              {
                id: "edit-employee",
                title: "Update employee",
                path: "edit/:emp_id",
                element: <EmployeesCreate />,
                loader: employeeLoader,
              },
            ],
          },
          {
            id: "roles",
            title: "roles",
            path: "roles",
            element: <RolesList />,
            loader: rolesLoader,
            children: [
              {
                id: "create-role",
                title: "Create role",
                path: "create-role",
                element: <CreateRoles />,
                loader: modulesLoader,
              },
              {
                id: "edit-role",
                title: "Edit role",
                path: "role/:role_id",
                element: <CreateRoles />,
                loader: roleLoader,
              },
            ],
          },
        ],
      },
      {
        id: "finance",
        title: "finance",
        Icon: FinanceIcon,
        path: "finance",
        element: <Outlet />,
        children: [],
      },
      {
        id: "settings",
        title: "settings",
        Icon: SettingsIcon,
        path: "settings",
        element: <Outlet />,
        children: [
          {
            id: "profile",
            title: "profile",
            path: "profile",
            element: <ProfileSettings />,
          },
          {
            id: "company",
            title: "company",
            path: "company",
            element: <CompanySettings />,
            children: [
              {
                id: "add-bank-account",
                title: "Add bank account",
                path: "add-bank-account",
                element: <div>Add bank account</div>,
              },
            ],
          },
          {
            id: "store",
            title: "store",
            path: "store",
            element: <StoreSettings />,
            children: [
              {
                id: "create-store",
                title: "Create store",
                path: "create-store",
                element: <CreateStore />,
              },
              {
                id: "single-store",
                title: "Single store",
                path: "single-store/:id",
                element: <CreateStore />,
              },
            ],
          },
          {
            id: "cashbox",
            title: "cashbox",
            path: "cashbox",
            element: <CashboxSettings />,
            children: [
              {
                id: "create-cashbox",
                title: "Create Cashbox",
                path: "create-cashbox",
                element: <CreateCashbox />,
              },
              {
                id: "single-cashbox",
                title: "Single cashbox",
                path: "single-cashbox/:id",
                element: <CreateCashbox />,
              },
            ],
          },
          {
            id: "receipt",
            title: "receipt",
            path: "receipt",
            element: <ReceiptSettings />,
            children: [
              {
                id: "create",
                title: "Create receipt",
                path: "create",
                element: <CreateReceipt />,
              },
              {
                id: "single-receipt",
                title: "Single receipt",
                path: "single-receipt/:receipt_id",
                element: <CreateReceipt />,
              },
            ],
          },
          {
            id: "products-settings",
            title: "products",
            path: "products",
            element: <ProductSettings />,
          },
          {
            id: "labels",
            title: "labels",
            path: "labels",
            element: <Labels />,
            children: [
              {
                id: "create-label",
                title: "Create Label",
                path: "create",
                element: <CreateLabel />,
              },
              {
                id: "edit-label",
                title: "Edit Label",
                path: "edit/:label_id",
                element: <CreateLabel />,
              },
            ],
          },
        ],
      },
      {
        id: "local-not-found",
        title: "Not found",
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    id: "auth",
    title: "Auth",
    path: "auth",
    element: <Auth />,
    children: [
      {
        id: "create-account",
        title: "Create account",
        path: "create-account",
        element: <CreateAccount />,
      },
      {
        id: "authenticate",
        title: "Authenticate",
        path: ":authType",
        element: <AuthComponent />,
      },
    ],
  },
  {
    id: "global-not-found",
    title: "Not found",
    path: "*",
    element: <h1>404: Page not found</h1>,
  },
];

export default routes;
