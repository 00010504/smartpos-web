import Drawer from "@/components/molecules/Drawer";
import { Button, Heading, useDisclosure } from "@chakra-ui/react";

export default function AddPostpone() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="link" onClick={onOpen} textAlign="center">
        Postpone
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading>Add postpone</Heading>}
        Body={<>...</>}
        Footer={<Button>Create</Button>}
      />
    </>
  );
}
