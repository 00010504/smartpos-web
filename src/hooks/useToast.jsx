import { useCallback } from "react";
import { useToast as useCkToast } from "@chakra-ui/react";
import Toast from "@/components/atoms/Toast";

export default function useToast() {
  const toast = useCkToast();

  const customToast = useCallback(
    ({ title, description, status = "error" }) => {
      toast({
        position: "top",
        duration: 3000,
        render: ({ onClose }) => (
          <Toast
            onClose={onClose}
            status={status}
            title={title}
            description={description}
          />
        ),
      });
    },
    [toast],
  );

  return { addToast: customToast };
}
