import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import Drawer from "../../molecules/Drawer";

export default function AddSeller() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        cursor="pointer"
        onClick={onOpen}
        bg="colors.greyF9"
        border="2px solid grey"
        px={2}
        py={1}
        borderRadius="full"
      >
        <AddIcon color="grey" />
      </Box>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading>Add seller</Heading>}
        Body={<Box>...</Box>}
        Footer={<Button>Create</Button>}
      />
    </>
  );
}
