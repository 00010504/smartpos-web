import { useEffect } from "react";
import { useLocation, useSubmit } from "react-router-dom";

export default function useSessionTimeout() {
  const submit = useSubmit();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      submit(null, { method: "post", action: "/logout" });
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [submit, location]);
}
