// from this routes, sideabar, header and some basic page styles will be removed from the page
const specialRoutes = [
  { path: "/:mainpath/:subpath/*/", removeSidebar: true, removeHeader: true },
  { path: "/sales/new-sale", removeHeader: true },
  {
    path: "/products/catalog/create-product",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/products/import/check/:file_uid",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/products/import/validation/:file_uid",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/products/import/preview/:file_uid",
    removeSidebar: true,
    removeHeader: true,
  },
  { path: "/settings/receipt/create", removeSidebar: true, removeHeader: true },
  {
    path: "/settings/receipt/single-receipt/:id",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/management/roles/create-role",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/management/roles/role/:role_id",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/products/catalog/edit/:id",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/sales/new-sale/payment",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/products/import/create-pricing-tag/:uid",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/settings/labels/create",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/settings/labels/edit/:label_id",
    removeSidebar: true,
    removeHeader: true,
  },
  {
    path: "/products/import/preview/:file_uid/view-only",
    removeSidebar: true,
    removeHeader: true,
  },
];

export default specialRoutes;
