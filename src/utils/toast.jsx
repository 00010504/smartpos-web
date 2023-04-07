import { createStandaloneToast } from "@chakra-ui/toast";
import theme from "@/theme";
import Toast from "@/components/atoms/Toast";

const { ToastContainer, toast } = createStandaloneToast({ theme });

const curriedToast = ({ status, title, description }) => {
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
};

export { ToastContainer, curriedToast as toast };
