import { Suspense } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigation,
  ScrollRestoration,
} from "react-router-dom";
import { useAuthContext } from "@/contexts/authContext";
import useWebSocket from "@/hooks/useWebSocket";
import useTitle from "@/hooks/useTitle";
import useOnline from "@/hooks/useOnline";
import useRouteLayout from "@/hooks/useRouteLayout";
import { ToastContainer } from "@/utils/toast";
import PropTypes from "prop-types";
import CommonLayout from "@/layouts/CommonLayout";
import Header from "@/components/templates/Header/Header";
import Sidebar from "@/components/templates/Sidebar/Sidebar";
import FullscreenSpinner from "@/components/atoms/FullscreenSpinner";
import Progress from "@/components/atoms/Progress/Progress";

export default function Root({ getRoutes }) {
  const { isAuth } = useAuthContext();
  const layout = useRouteLayout();
  const { pathname } = useLocation();
  const navigation = useNavigation();

  useWebSocket();
  useTitle(getRoutes());
  useOnline();

  const getLayoutState = (isSpecial) => {
    if (isSpecial) {
      return {
        header: !layout.removeHeader ? <Header /> : null,
        sidebar: !layout.removeSidebar ? (
          <Sidebar items={getRoutes()[0].children.slice(1, -1)} />
        ) : null,
        styles: {
          minHeight: "100vh",
        },
      };
    }

    return {
      header: <Header />,
      sidebar: <Sidebar items={getRoutes()[0].children.slice(1, -1)} />,
      styles: {
        h: "100vh", // for sticky goback component
      },
    };
  };

  const layoutState = getLayoutState(layout.isSpecial);

  return (
    <>
      {!isAuth && <Navigate replace to="/auth/login" />}
      {pathname === "/" && <Navigate replace to="/dashboard" />}

      <ToastContainer />
      <ScrollRestoration />
      <Progress isAnimating={navigation.state === "loading"} />

      <CommonLayout
        header={layoutState.header}
        sidebar={layoutState.sidebar}
        styles={layoutState.styles}
      >
        <Suspense
          fallback={<FullscreenSpinner h="calc(100vh - 66px - 28px - 45px)" />}
        >
          <Outlet />
        </Suspense>
      </CommonLayout>
    </>
  );
}

Root.propTypes = {
  getRoutes: PropTypes.func.isRequired,
};
