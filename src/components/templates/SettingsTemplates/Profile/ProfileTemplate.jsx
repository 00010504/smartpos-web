import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { isEqual } from "lodash";
import {
  Box,
  Button,
  Fade,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import ChangeInterface from "@/components/organisms/ProfileSettingOrganism/ChangeInterface";
import ChangePassword from "@/components/organisms/ProfileSettingOrganism/ChangePassword";
import AvatarUpload from "@/components/molecules/Upload/AvatarUpload";
import Avatar from "@/components/atoms/profileAvatar/Avatar";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import useToast from "@/hooks/useToast";
import { updateProfile } from "@/services";
import { getProfileQuery } from "@/queries";
import { avatardata } from "./data";

export default function ProfileTemplate() {
  const [profile, setProfile] = useState({});
  const [selectedImg, setSelectedImg] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: profileData, isFetched } = useQuery({
    ...getProfileQuery(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...profile, image: selectedImg, color: selectedColor };
    updateProfile(payload)
      .then(() => {
        queryClient.invalidateQueries(["profile"]);
        addToast({
          title: t("changes_saved"),
          status: "success",
        });
      })
      .catch(() => addToast({ title: "could_not_save" }));
  };

  const displayLetters = `${
    profile?.first_name ? profile.first_name[0].toUpperCase() : ""
  }${profile?.last_name ? profile.last_name[0].toUpperCase() : ""}`;

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      if (profileData.image) {
        setSelectedImg(profileData.image);
      }
      if (profileData.color) {
        setSelectedColor(profileData.color);
      }
    }
  }, [profileData]);

  return (
    <form onSubmit={handleSubmit}>
      <Flex justify="space-between">
        <Box>
          <Heading fontSize="28px">{t("profile")}</Heading>
          <Breadcrumb
            options={[
              { href: "/", name: t("dashboard"), isLink: true },
              { name: t("settings"), isLink: false },
              { name: t("profile_update"), isLink: false },
            ]}
          />
        </Box>
        <Flex gap="24px" pt="10px">
          <Button
            color="#EB5757"
            isDisabled={
              isEqual(profileData, profile) &&
              profileData?.image === selectedImg &&
              profileData?.color === selectedColor
            }
            onClick={() => {
              setProfile(profileData);
              setSelectedImg(profileData?.image);
            }}
            {...styles.button}
          >
            {t("reset")}
          </Button>
          <Button
            color="#256DF6"
            type="submit"
            isDisabled={
              isEqual(profileData, profile) &&
              profileData?.image === selectedImg &&
              profileData?.color === selectedColor
            }
            onClick={handleSubmit}
            {...styles.button}
          >
            {t("save")}
          </Button>
        </Flex>
      </Flex>

      {isFetched && (
        <Fade in>
          <SimpleGrid gap="42px">
            <Box>
              <SectionHeader title="main" />
              <Grid
                templateRows="repeat(1.5,1fr)"
                templateColumns="repeat(10, 1fr)"
                gap={4}
              >
                <GridItem rowSpan={2}>
                  <AvatarUpload
                    selectedImg={selectedImg}
                    color={selectedColor}
                    setSelectedImg={setSelectedImg}
                    displayLetters={displayLetters}
                  />
                </GridItem>
                <GridItem colSpan={9}>
                  <Flex gap={4} flexWrap="wrap" mt={4}>
                    {avatardata?.map((data) => (
                      <Avatar
                        type={data?.imgUrl ? "image" : "gradient"}
                        onClick={() => {
                          if (data?.imgUrl) {
                            setSelectedImg(data.imgUrl);
                            setSelectedColor("");
                          } else {
                            setSelectedColor(data.colorScheme);
                            setSelectedImg("");
                          }
                        }}
                        selectedImg={selectedImg}
                        selectedColor={selectedColor}
                        key={data.id}
                        imageUrl={data?.imgUrl ?? null}
                        color={data?.colorScheme ?? null}
                        name={profile?.first_name}
                        lastname={profile?.last_name}
                        displayLetters={displayLetters}
                      />
                    ))}
                  </Flex>
                </GridItem>
                <GridItem colSpan={8} mt={4}>
                  <Text color="grey.800">{t("upload_format_format")}</Text>
                </GridItem>
              </Grid>
              <Flex gap="32px" mt={5}>
                <FormControl>
                  <FormLabel htmlFor="name">{t("name")}</FormLabel>
                  <Input
                    id="name"
                    value={profile.first_name ?? ""}
                    placeholder={t("enter_name")}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }));
                    }}
                    {...styles.inputStyles}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="surname">{t("surname")}</FormLabel>
                  <Input
                    id="surname"
                    value={profile.last_name ?? ""}
                    placeholder={t("enter_surname")}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }));
                    }}
                    {...styles.inputStyles}
                  />
                </FormControl>
              </Flex>
            </Box>
            <Box>
              <SectionHeader title="security" />
              <ChangePassword />
            </Box>
            <Box>
              <SectionHeader title="interface" />
              <ChangeInterface />
            </Box>
          </SimpleGrid>
        </Fade>
      )}
    </form>
  );
}

const styles = {
  button: {
    width: 110,
    colorScheme: "gray",
    height: "45px",
  },
  inputStyles: {
    padding: "24px 15px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
    _placeholder: {
      color: "#737373 !important",
    },
  },
};
