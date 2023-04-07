import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmptyBasket from "@/components/molecules/SalesMolecules/EmptyBasket";
import { getOrderQuery } from "@/queries";
import {
  Heading,
  HStack,
  SimpleGrid,
  Tag,
  TagLabel,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import keydown from "@/events/keydown";
import AddSeller from "./AddSeller";
import SaleProduct from "./SaleProduct";

export default function Main() {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("order") || "{}");
  const { t } = useTranslation();

  const { data } = useQuery({
    ...getOrderQuery(order?.id),
    enabled: !!order?.id,
  });

  const f5Press = useCallback(
    (e) => {
      if (data?.items && e.code === "F5") {
        e.preventDefault();
        navigate("/sales/new-sale/payment");
        keydown.unregister();
      }
    },
    [data?.items, navigate],
  );

  useEffect(() => {
    keydown.register(f5Press);

    return () => {
      keydown.unregister();
    };
  }, [f5Press]);

  return (
    <VStack align="stretch" h="100%" spacing={6}>
      <HStack gap="10px">
        <Heading fontSize="28px" fontWeight={600} mr="10px">
          {t("basket")}
        </Heading>
        <Tag {...styles.tag} color="grey.800" fontSize="xl" fontWeight="bold">
          <TagLabel pt="2px">
            {data?.product_sort_count || 0} {t("pcs")}
          </TagLabel>
        </Tag>
        <Tag {...styles.tag} color="white" fontSize="lg" bg="colors.link">
          <TagLabel pt="2px">{t("all_sellers")}</TagLabel>
        </Tag>
        <AddSeller />
      </HStack>
      {(data?.items.length === 0 || !data) && <EmptyBasket />}
      {data?.items && (
        <SimpleGrid gap="10px" pb="80px">
          {data.items?.map((item) => {
            return <SaleProduct key={item.id} orderItem={item} />;
          })}
        </SimpleGrid>
      )}
    </VStack>
  );
}

const styles = {
  tag: {
    size: "lg",
    py: 1,
    borderRadius: "full",
    colorScheme: "grey",
    variant: "solid",
  },
};
