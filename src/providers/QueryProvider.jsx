import { QueryClientProvider } from "@tanstack/react-query";
import SingleQueryClient from "@/classes/SingleQueryClient";
import PropTypes from "prop-types";

const queryClient = SingleQueryClient.getInstance();

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

QueryProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
