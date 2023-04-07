import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import {
  Box,
  Flex,
  FormLabel,
  Image,
  Input,
  InputGroup,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SimpleGrid,
} from "@chakra-ui/react";
import { getClientsQuery, getOrderQuery } from "@/queries";
import ClientIcon from "@/assets/icons/client-icon.svg";
import { addOrderClient, deleteOrderClient } from "@/services";
import deleteicon from "@/assets/delete.svg";
import { css, clientsCss } from "./data";

function AddClient() {
  const [clientsSearch, setClientsSearch] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const orderData = JSON.parse(localStorage.getItem("order") || "{}");
  const { t } = useTranslation();
  const searchRef = useRef();

  const { data: clients } = useQuery({
    ...getClientsQuery({
      page: "1",
      limit: "20",
      search: clientsSearch,
    }),
    enabled: !!clientsSearch,
  });

  const { data: order } = useQuery({
    ...getOrderQuery(orderData.id),
    enabled: !!orderData.id,
  });

  const onClickClient = (client) => {
    queryClient.removeQueries(["clients"]);
    addOrderClient(orderData.id, {
      client_id: client.id,
      order_id: orderData.id,
    }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["order", orderData.id],
      });
      setOpen(false);
      setClientsSearch("");
      searchRef.current.value = client.first_name;
    });
  };

  const onDeleteOrderClient = () => {
    deleteOrderClient(orderData.id).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["order", orderData.id],
      });
      setClientsSearch("");
      searchRef.current.value = "";
    });
  };

  const debouncedSearch = useMemo(() => {
    return debounce(
      (e) => debounce(setClientsSearch(e.target.value), 500),
      500,
    );
  }, []);

  useEffect(() => {
    if (order?.id) {
      setClientsSearch(order?.client?.first_name);
    }
  }, [order]);

  return (
    <Box position="relative">
      <Flex alignItems="center">
        <FormLabel color="colors.greyF9" fontWeight={600}>
          {t("client").toUpperCase()}
        </FormLabel>
        <Text {...css.kdb} mt="-8px" pl="0px">
          C
        </Text>
      </Flex>
      <Popover isOpen={open && clients?.data.length > 0}>
        <PopoverTrigger>
          <InputGroup display="flex" direction="column" position="relative">
            <Input
              ref={searchRef}
              onChange={debouncedSearch}
              onFocus={() => setOpen(true)}
              placeholder={t("customer_name_number")}
              disabled={order?.client?.id}
              _disabled={{
                opacity: 1,
              }}
              {...css.input}
            />
            {order?.client?.id && (
              <Image
                {...clientsCss.deleteIcon}
                src={deleteicon}
                onClick={onDeleteOrderClient}
              />
            )}
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent border="none">
          <SimpleGrid gap="10px" {...clientsCss.clients}>
            {clients?.data?.map((client) => (
              <Flex
                key={client.id}
                onClick={() => onClickClient(client)}
                {...clientsCss.clientResultBox}
              >
                <Image src={ClientIcon} alt="" />
                <Box>
                  <Text color="colors.grey45" fontWeight={700}>
                    {`${client.first_name} ${client.last_name}`}
                  </Text>
                  <Text fontSize="14px">+{client.phone_number}</Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </PopoverContent>
      </Popover>
    </Box>
  );
}

export default AddClient;
