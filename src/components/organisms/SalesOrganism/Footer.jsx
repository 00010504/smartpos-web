import { Box, Flex } from "@chakra-ui/react";
// import AddPostpone from "./AddPostpone";

export default function Footer() {
  const order = JSON.parse(localStorage.getItem("order") || "{}");

  return (
    <Box
      p="14px 48px"
      pr="20%"
      position="fixed"
      bottom={0}
      zIndex="auto"
      width="70%"
      bg="colors.sidebar"
      transform="translateX(-36px)"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px"
    >
      <Flex justifyContent="center" width="100%">
        {/* <AddPostpone /> */}
        <Box as="span">
          {order?.company?.name
            ? `${order.company.name} | ${order.shop.title}`
            : ""}
        </Box>
      </Flex>
    </Box>
  );
}
