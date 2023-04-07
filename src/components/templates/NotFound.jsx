import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "@/assets/images/not-found.svg";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      height="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="15px"
      bg="colors.grayF9"
      borderRadius="15px"
    >
      <Image width="350px" src={NotFoundImage} alt="" />
      <Heading mt="16px" size="lg">
        Page not found
      </Heading>
      <Text
        fontWeight={600}
        width="450px"
        textAlign="center"
        color="colors.icon"
      >
        We’re sorry, the page you requested could not be found Please go back to
        the dashboard 🔙
      </Text>
      <Button
        height="48px"
        mt="10px"
        type="button"
        onClick={() => navigate("/")}
      >
        Go to dashboard
      </Button>
    </Box>
  );
}

export default NotFound;
