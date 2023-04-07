import ReactDOM from "react-dom/client";
import ChakraProvider from "./providers/ChakraProvider";
import AuthProvider from "./providers/AuthProvider";
import RouteProvider from "./providers/RouteProvider";
import LangProvider from "./providers/LangProvider";
import QueryProvider from "./providers/QueryProvider";
import ColorModeProvider from "./providers/ColorModeProvider";
import ImportValidationProvider from "./providers/ImportValidationProvider";
import AbilityProvider from "./providers/AbilityProvider";
import initialize from "./helpers/initialize";
import "./index.css";

initialize();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryProvider>
    <ColorModeProvider>
      <ChakraProvider>
        <LangProvider>
          <AuthProvider>
            <AbilityProvider>
              <ImportValidationProvider>
                <RouteProvider />
              </ImportValidationProvider>
            </AbilityProvider>
          </AuthProvider>
        </LangProvider>
      </ChakraProvider>
    </ColorModeProvider>
  </QueryProvider>,
);
