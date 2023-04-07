import { useQuery } from "@tanstack/react-query";
import {
  Fade,
  Flex,
  Box,
  Button,
  Table,
  Tr,
  Thead,
  Tbody,
  Th,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getCategoriesQuery } from "@/queries";
import CategoryRow from "./CategoryRow";
import CreateCategory from "./CreateCategory";
import { tableStyles, styles } from "./data";

function CategoriesList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const { data } = useQuery({
    ...getCategoriesQuery(),
  });

  return (
    <Fade in>
      <CreateCategory isOpen={isOpen} onClose={onClose} />
      <Flex {...styles.container}>
        <Box />
        <Button {...styles.createButton} onClick={onOpen}>
          {t("create")}
        </Button>
      </Flex>
      <Table marginTop="25px">
        <Thead {...tableStyles.thead}>
          <Tr>
            <Th width="80%" {...tableStyles.th}>
              {t("name")}
            </Th>
            <Th {...tableStyles.th}>{t("")}</Th>
            <Th {...tableStyles.th}>{t("actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data?.map((category) => (
            <CategoryRow key={category.name} category={category} />
          ))}
        </Tbody>
      </Table>
    </Fade>
  );
}

export default CategoriesList;
