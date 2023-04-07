import { useState } from "react";
import { DateRangePicker as DatePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./DateRangePicker.css";
import {
  Button,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { lightFormat } from "date-fns";
import PropTypes from "prop-types";
import DeleteIcon from "@/assets/icons/delete.svg";
import { useTranslation } from "react-i18next";

function DateRangePicker({ onChange, selectionRange, deletable }) {
  const [open, setOpen] = useState(false);
  const { startDate, endDate } = selectionRange;
  const { t } = useTranslation();

  const ranges = [
    {
      startDate,
      endDate,
      key: "selection",
    },
  ];

  const deleteHandler = (e) => {
    e.preventDefault();
    onChange({
      selection: {
        startDate: "",
        endDate: "",
        key: "selection",
      },
    });
  };

  return (
    <Popover
      placement="bottom-start"
      isOpen={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <PopoverTrigger>
        <Button
          border="1px solid"
          borderColor="colors.sidebarBorder"
          h="50px"
          colorScheme="gray"
          variant="ghost"
          mt="8px"
          fontSize="13px"
          color="colors.icon"
          position="relative"
        >
          {` ${
            startDate ? lightFormat(startDate, "dd.MM.yyyy") : t("not_selected")
          }
          - ${
            endDate ? lightFormat(endDate, "dd.MM.yyyy") : t("not_selected")
          }`}
          {(startDate || endDate) && deletable && (
            <Image
              src={DeleteIcon}
              alt=""
              width="15px"
              position="absolute"
              top="2px"
              right="2px"
              borderRadius="50%"
              onClick={deleteHandler}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent width="550px" zIndex="popover">
        <DatePicker ranges={ranges} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;

DateRangePicker.defaultProps = {
  deletable: true,
};

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectionRange: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    key: PropTypes.string,
  }).isRequired,
  deletable: PropTypes.bool,
};
