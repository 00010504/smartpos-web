import { Suspense, useEffect } from "react";
import { Outlet, useNavigate, useMatch } from "react-router-dom";
import { useAuthContext } from "@/contexts/authContext";
import useLatestClosure from "@/hooks/useLatestClosure";
import FullScreenSpinner from "@/components/atoms/FullscreenSpinner";

const CHILD_ROUTES = {
  login: "login",
  reset: "reset",
  register: "register",
  "create-account": "create-account",
  complete: "complete",
  verify: "verify",
};

function Auth() {
  const navigate = useNavigate();
  const match = useMatch("/auth/*");
  const { isAuth } = useAuthContext();

  const navigateToLogin = useLatestClosure(() =>
    navigate("/auth/login", { replace: true }),
  );

  useEffect(() => {
    const hasOtpToken = sessionStorage.getItem("otpToken");
    const temporary_token = sessionStorage.getItem("temporary_token");
    const currStep = CHILD_ROUTES[match.params["*"]];
    const someFails = [
      !currStep,
      !hasOtpToken && currStep === CHILD_ROUTES.complete,
      !temporary_token && currStep === CHILD_ROUTES["create-account"],
    ].some((bool) => bool === true);

    if (someFails) {
      navigateToLogin();
    }
  }, [match, navigateToLogin]);

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <Suspense fallback={<FullScreenSpinner h="100vh" />}>
      <Outlet />
    </Suspense>
  );
}

export default Auth;
