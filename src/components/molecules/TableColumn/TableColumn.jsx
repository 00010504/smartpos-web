import { useEffect, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { Draggable } from "react-beautiful-dnd";
import { Flex, Image, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import clarityCursorIcon from "@/assets/clarity_cursor.svg";
import { getWidthsInPx, headingStyles, rowStyles, widths } from "./data";
// import ColumnResizer from "./ColumnResizer.old";
// import ColumnResizer from "./ColumnResizer";

export default function TableColumn({ header, rows, colIdx, isLast }) {
  const isFirst = colIdx === 0;
  const isDraggable = !isFirst && !isLast;

  return isDraggable ? (
    <Draggable draggableId={`draggable-${header.id}`} index={colIdx}>
      {(provided) => (
        <Column
          header={header}
          rows={rows}
          colIdx={colIdx}
          providedDrag={provided}
        />
      )}
    </Draggable>
  ) : (
    <Column header={header} rows={rows} colIdx={colIdx} isLast={isLast} />
  );
}

function Column({ header, rows, colIdx, providedDrag, isLast }) {
  const [widthsInPx, setWidthsInPx] = useState({});
  const isFirst = colIdx === 0;
  const isDraggable = !isFirst && !isLast;
  const ref = isDraggable ? providedDrag?.innerRef : null;
  const dragHandleProps = isDraggable ? providedDrag?.dragHandleProps : {};
  const draggableProps = isDraggable ? providedDrag?.draggableProps : {};
  const sx = isDraggable
    ? {
        "&:hover": {
          "& > .drag-handle": {
            visibility: "visible",
          },
        },
      }
    : {};

  useEffect(() => {
    setWidthsInPx(getWidthsInPx(widths));
  }, []);

  return (
    <VStack
      ref={ref}
      {...draggableProps}
      align="stretch"
      w={widthsInPx[header.id]}
      minW="50px"
      spacing={0}
      pos="relative"
      className={isLast ? "" : "col"}
      id={header.id}
      // bg="colors.table"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderLeftRadius={isFirst ? "10px" : 0}
        borderRightRadius={isLast ? "10px" : 0}
        {...headingStyles}
        sx={sx}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {isDraggable ? (
          <Image
            src={clarityCursorIcon}
            alt="drag"
            w="25px"
            h="25px"
            className="drag-handle"
            cursor="grab"
            visibility="hidden"
            mr="4"
            {...dragHandleProps}
          />
        ) : null}
      </Flex>

      {rows.map((row, i) => (
        <Flex
          alignItems="center"
          key={row.id}
          fontFamily="Inter"
          borderLeftRadius={isFirst && "10px"}
          borderRightRadius={isLast && "10px"}
          bg={i % 2 === 0 ? "colors.grayF9" : ""}
          {...rowStyles}
        >
          {flexRender(
            row.getVisibleCells()[colIdx].column.columnDef.cell,
            row.getVisibleCells()[colIdx].getContext(),
          )}
        </Flex>
      ))}

      {/* {isLast ? null : <ColumnResizer />} */}
    </VStack>
  );
}

TableColumn.defaultProps = {
  colIdx: null,
  isLast: false,
};

TableColumn.propTypes = {
  header: PropTypes.shape({
    id: PropTypes.string,
    column: PropTypes.shape({
      columnDef: PropTypes.shape({
        header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      }),
    }),
    getContext: PropTypes.func,
  }).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      getVisibleCells: PropTypes.func,
    }),
  ).isRequired,
  colIdx: PropTypes.number,
  isLast: PropTypes.bool,
};

Column.defaultProps = {
  colIdx: null,
  isLast: false,
  providedDrag: null,
};

Column.propTypes = {
  header: PropTypes.shape({
    id: PropTypes.string,
    column: PropTypes.shape({
      columnDef: PropTypes.shape({
        header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      }),
    }),
    getContext: PropTypes.func,
  }).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      getVisibleCells: PropTypes.func,
    }),
  ).isRequired,
  colIdx: PropTypes.number,
  providedDrag: PropTypes.shape({
    innerRef: PropTypes.func,
    dragHandleProps: PropTypes.shape({}),
    draggableProps: PropTypes.shape({}),
  }),
  isLast: PropTypes.bool,
};
