import { useEffect } from "react";
import online from "@/events/online";
import offline from "@/events/offline";
import useToast from "@/hooks/useToast";

const successMsg = (cb) =>
  cb({ title: "Internet connection established", status: "success" });
const errorMsg = (cb) =>
  cb({ title: "No internet connection", status: "error" });

export default function useOnline() {
  const { addToast } = useToast();

  useEffect(() => {
    online.register(successMsg.bind(null, addToast));
    offline.register(errorMsg.bind(null, addToast));

    return () => {
      online.unregister();
      offline.unregister();
    };
  }, [addToast]);
}
