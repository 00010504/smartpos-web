import {
  Box,
  Badge,
  Heading,
  useDisclosure,
  Text,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import NotificationIcon from "@/components/atoms/Icons/Notification";
import Drawer from "@/components/molecules/Drawer";
import styles from "./styles";

const notifications = [
  {
    id: 1,
    from: "SmartPOS",
    message:
      "Lorem ipsum dolor sit amet, consectetur opas adipiscing elit. Aliquet neque nunc aliquame nec. Fermentum feugiat nisi, eros sit eget quis.",
  },
];

function Notifications() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box {...styles.icon_wrapper} onClick={onOpen}>
        <NotificationIcon color="colors.icon2" {...styles.icon} />
        <Badge {...styles.icon_badge} backgroundColor="#FFCD4B">
          5
        </Badge>
      </Box>
      <Drawer
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading size="lg">Notifications</Heading>}
        Body={
          <Box p="16px" bg="colors.grayF9" borderRadius="10px" mt="25px">
            {notifications.map((notification) => (
              <Box {...styles.notification} key={notification.id}>
                <Heading size="md" color="colors.link">
                  {notification.from}
                </Heading>
                <Text m="12px 0">{notification.message}</Text>
                <SimpleGrid columns={2} gap="18px" mt="15px">
                  <Button
                    color="#EB5757"
                    colorScheme="white"
                    bg="#fff"
                    height="50px"
                  >
                    Reject
                  </Button>
                  <Button
                    colorScheme="white"
                    bg="#fff"
                    height="50px"
                    color="#6FCF97"
                  >
                    Accept
                  </Button>
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        }
        Footer={<Box>Footer</Box>}
      />
    </>
  );
}

export default Notifications;
