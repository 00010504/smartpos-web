import { createContext, useContext } from "react";

const authContext = createContext({
  isAuth: false,
  setIsAuth: () => {},
});

authContext.displayName = "authContext";

const AuthContextConsumer = authContext.Consumer;

export { AuthContextConsumer as AuthConsumer, authContext, useAuthContext };

function useAuthContext() {
  return useContext(authContext);
}
