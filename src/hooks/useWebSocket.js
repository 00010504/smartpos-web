import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import connectSocket from "@/utils/websocket";
import { handlersChain } from "@/helpers/registerHandler";

export default function useWebSocket() {
  // const rerender = useReducer(() => ({}), {})[1];
  const { isAuth } = useAuthContext();
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (isAuth) {
      const websocket = connectSocket(handlersChain);
      setWs(websocket);
    }
  }, [isAuth]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close(1000);
      }
    };
  }, [ws]);
}
