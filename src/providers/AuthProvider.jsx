import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { authContext } from "@/contexts/authContext";
import validateToken from "@/helpers/validateToken";

export default function AuthProvider({ children }) {
  const token = localStorage.getItem("token");
  const isValid = validateToken(token);

  const [isAuth, setIsAuth] = useState(isValid);

  const value = useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
