import {
  isRouteErrorResponse,
  Link as RouterLink,
  useRouteError,
} from "react-router-dom";
import { Alert, AlertIcon, Flex, Link, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function ErrorMessage() {
  const { t } = useTranslation();
  const error = useRouteError();
  console.log("isRouterError: ", isRouteErrorResponse(error));
  console.log(error);

  return (
    <Alert status="error" justifyContent="space-between">
      <Flex alignItems="center">
        <AlertIcon />
        <Text>There was an error loading the page</Text>
      </Flex>
      <Link as={RouterLink} to={-1}>
        {t("go_back")}
      </Link>
    </Alert>
  );
}
