import {
  Avatar as AvatarComponent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Image,
  PopoverArrow,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import UserIcon from "@/assets/user.svg";
import LogoutIcon from "@/assets/login.svg";
import { getProfileQuery } from "@/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useTranslation } from "react-i18next";

function Avatar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openPopover, setOpenPopover] = useState();
  const navigate = useNavigate();
  const { setIsAuth } = useAuthContext();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  let { data: profileData } = useQuery({
    ...getProfileQuery(),
  });

  profileData = profileData ?? {
    first_name: "",
    last_name: "",
    image: "",
    color: "",
  };

  const getBgColor = () => {
    if (profileData?.image) {
      return "transparent";
    }
    if (profileData?.color) {
      return profileData?.color;
    }
    return "rgba(0,0,0,0.2)";
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("order");
    localStorage.removeItem("refresh_token");
    queryClient.clear();
    setIsAuth(false);
  };

  return (
    <>
      <Popover
        offset={[-40, 5]}
        initialFocusRef={null}
        isOpen={openPopover}
        onOpen={() => setOpenPopover(true)}
        onClose={() => setOpenPopover(false)}
        zIndex="popover"
      >
        <PopoverTrigger>
          <Button
            variant="link"
            _hover={{
              backgroundColor: "transparent",
            }}
          >
            <AvatarComponent
              pt="3px"
              size="md"
              bg={getBgColor}
              color="#fff"
              fontWeight={700}
              name={`${profileData?.first_name} ${profileData?.last_name}`}
              src={profileData?.image}
              boxShadow="inner"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          width="130px"
          p="2px 5px"
          top="5px"
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
          bg="colors.body"
        >
          <PopoverArrow bg="colors.body" />
          <PopoverBody>
            <Text
              mb="10px"
              cursor="pointer"
              {...linkStyles}
              onClick={() => {
                navigate("/settings/profile");
                setOpenPopover(false);
              }}
            >
              {t("profile")} <Image w="20px" h="20px" src={UserIcon} alt="" />
            </Text>
            <Text color="#EB5757" {...linkStyles} onClick={onOpen}>
              {t("logout")} <Image w="20px" h="20px" src={LogoutIcon} alt="" />
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          p="45px 16px 16px 16px"
          textAlign="center"
          borderRadius="20px"
          bg="colors.body"
        >
          <ModalBody>
            <Heading size="lg" mb={2}>
              Log out
            </Heading>
            <Text mb="15px">Are you sure you log out from account</Text>
          </ModalBody>

          <ModalFooter display="grid" gridTemplateColumns="1fr 1fr" gap="10px">
            <Button
              mr={3}
              onClick={onClose}
              colorScheme="gray"
              color="#256DF6"
              height="50px"
            >
              Cancel
            </Button>
            <Button
              height="50px"
              colorScheme="gray"
              bg="colors.grayF9"
              color="#EB5757"
              onClick={logoutHandler}
            >
              Log out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Avatar;

const linkStyles = {
  fontWeight: 600,
  fontSize: 16,
  display: "flex",
  gap: "15px",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
};
