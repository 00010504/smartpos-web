/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import {
  Flex,
  Image,
  Button,
  Tooltip,
  IconButton,
  Box,
  HStack,
} from "@chakra-ui/react";
import filterIcon from "@/assets/images/sale/returns.svg";
import { cashboxShift, getSaleProducts } from "@/services";
import keypress from "@/events/keypress";
import LockIcon from "@/components/atoms/SVGs/Lock";
import SearchWithPopup from "../SearchWithPopup";

export default function Header({ shift }) {
  const [prodData, setProdData] = useState({});
  const searchRef = useRef(null);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "5",
  });
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("order") || "{}");

  const fPress = useCallback((e) => {
    if (e.code === "KeyF") {
      e.preventDefault();
      searchRef.current.focus();
      keypress.unregister();
    }
  }, []);

  const closeShift = () => {
    cashboxShift({
      cashbox_id: shift.cashbox_id,
      method: "close",
    }).then(() => {
      localStorage.removeItem("order");
      queryClient.invalidateQueries({
        queryKey: ["defaultShift"],
      });
      queryClient.removeQueries(["order", order?.id]);
      navigate("/sales/all-sales");
    });
  };

  const getProductsForSearch = async () => {
    if (searchRef.current.value) {
      const data = await getSaleProducts({
        search: searchParams.get("search"),
        limit: "10",
        page: searchParams.get("page"),
      });
      if (searchParams.get("search")) {
        setProdData(data);
      }
    }
  };

  const debouncedSearch = useMemo(() => {
    return debounce(setSearchParams, 500);
  }, []);

  const onSearchChange = (val) => {
    return debouncedSearch((prev) => {
      prev.set("search", val);
      return prev;
    });
  };

  useEffect(() => {
    keypress.register(fPress);

    return () => {
      keypress.unregister();
    };
  }, []);

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      searchRef.current.value = searchVal;
    }
  }, []);

  useEffect(() => {
    getProductsForSearch();
  }, [searchParams]);

  return (
    <HStack spacing={8}>
      <Box w="100%">
        <SearchWithPopup
          register={() => keypress.register(fPress)}
          searchRef={searchRef}
          placeholder={t("article_barcode_name")}
          onChange={onSearchChange}
          searchResult={prodData.data}
          inputProps={{
            bg: "colors.grayF9",
            border: "none",
            margin: "0 !important",
            padding: "28px",
            fontSize: "17px !important",
            zIndex: "dropdown !important",
            width: "100%",
          }}
          containerProps={{ margin: 0 }}
          clearSearch={() => {
            searchRef.current.value = "";
          }}
        />
      </Box>

      <Flex gap="20px">
        <Tooltip label={t("returns_and_exchanges")} {...tooltip}>
          <Button variant="link">
            <Image
              width="56px"
              cursor="pointer"
              src={filterIcon}
              alt="filter"
            />
          </Button>
        </Tooltip>

        <Tooltip label={t("close_shift")} {...tooltip}>
          <IconButton
            variant="link"
            onClick={closeShift}
            icon={<LockIcon active />}
          />
        </Tooltip>
      </Flex>
    </HStack>
  );
}

Header.defaultProps = {
  shift: {},
};

Header.propTypes = {
  shift: PropTypes.shape({
    cashbox_id: PropTypes.string,
  }),
};

const tooltip = {
  hasArrow: true,
  p: "10px 15px",
  borderRadius: "10px",
  bg: "#454545",
  color: "#fff",
  fontWeight: 700,
};
