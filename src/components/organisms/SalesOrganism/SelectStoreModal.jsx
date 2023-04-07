import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import SwipeableViews from "react-swipeable-views";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Image,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { getShops, getCashboxList, cashboxShift } from "@/services";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import Step1Img from "@/assets/images/sale/sale-step-1.svg";
import Step2Img from "@/assets/images/sale/sale-step-2.svg";
import Step3Img from "@/assets/images/sale/sale-step-3.svg";
import Select from "@/components/molecules/Select/Select";
import LeftIcon from "@/components/atoms/Icons/Left";

// form fields and validation 🚧
const schema = createSchema({
  // store: "select",
  // cashbox: "select",
});
const values = { store: "", cashbox_id: "" };

function SelectStoreModal() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [shops, setShops] = useState();
  const [cashboxes, setCashboxes] = useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    if (step === 0) {
      setStep(step + 1);
    }
    if (step === 1) {
      setStep(step + 1);
    }
    if (step === 2) {
      cashboxShift({
        cashbox_id: data.cashbox_id.value,
        method: "open",
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["defaultShift"],
          refetchType: "all",
        });
        setOpen(false);
      });
    }
  });

  useEffect(() => {
    getShops().then((res) => {
      setShops(
        res.data.map((shop) => {
          return {
            value: shop.id,
            label: shop.title,
          };
        }),
      );
    });
  }, []);

  const store = watch("store");

  useEffect(() => {
    getCashboxList({
      shop_id: store.value,
    }).then((res) => {
      setCashboxes(
        res.data.map((cashbox) => {
          return {
            value: cashbox.id,
            label: cashbox.name,
          };
        }),
      );
    });
  }, [store]);

  const disabledButton = () => {
    if (step === 0) return !watch("store");
    if (step === 1) return !watch("cashbox_id");
    return false;
  };

  return (
    <Modal isOpen={open} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent
        borderRadius="15px"
        py="20px"
        width="360px"
        bg="colors.sidebar"
      >
        <ModalBody>
          <Box display="flex" justifyContent="center" overflowX="hidden" mb={4}>
            <SwipeableViews index={step}>
              <Image src={Step1Img} {...styles.img} />
              <Image src={Step2Img} {...styles.img} />
              <Image src={Step3Img} {...styles.img} />
            </SwipeableViews>
          </Box>
          <Flex justifyContent="center" mt="30px">
            <Box {...styles.dot} {...(step === 0 ? styles.activeDot : {})} />
            <Box {...styles.dot} {...(step === 1 ? styles.activeDot : {})} />
            <Box {...styles.dot} {...(step === 2 ? styles.activeDot : {})} />
          </Flex>
          <IconButton
            top="15px"
            left="15px"
            position="absolute"
            width="30px"
            size="sm"
            rounded="full"
            icon={<LeftIcon width="20px" color="#fff" />}
            onClick={() => {
              if (step === 0) {
                navigate(-1);
              } else {
                setStep(step - 1);
              }
            }}
          />
          <Box p="6px" pb="8px" pt="20px">
            {step === 0 && (
              <Select
                name="store"
                control={control}
                errors={errors}
                label={t("store")}
                options={shops || []}
                styles={styles.select}
                selectProps={{
                  placeholder: t("select_store"),
                }}
              />
            )}
            {step === 1 && (
              <Select
                name="cashbox_id"
                control={control}
                errors={errors}
                label={t("cashbox")}
                options={cashboxes || []}
                styles={styles.select}
                selectProps={{
                  placeholder: t("select_cashbox"),
                }}
              />
            )}
            <Button
              {...styles.button}
              onClick={onSubmit}
              disabled={disabledButton()}
              color="#fff"
            >
              {step === 0 || step === 1 ? t("next") : t("open_shift")}
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SelectStoreModal;

const styles = {
  img: {
    width: "300px",
    height: "140px",
    alt: "",
    ml: "12px",
  },
  select: {
    control: (provided) => ({
      ...provided,
      height: "54px",
      background: "colors.grayF9",
      padding: "6px 10px",
      borderRadius: "10px",
      mt: "30px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
  },
  button: {
    mt: "30px",
    height: "54px",
    width: "100%",
    fontSize: "17px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    bg: "gray.300",
    mx: "4px",
    transition: "all 0.3s",
  },
  activeDot: {
    width: "28px",
    height: "10px",
    borderRadius: "10px",
    bg: "colors.link",
    mx: "5px",
  },
};
