import {
  // QueryCache,
  QueryClient,
} from "@tanstack/react-query";
// import { toast } from "@/utils/toast";
import settings from "@/config/settings";

export default class SingleQueryClient {
  static #queryClient;

  static getInstance() {
    if (!this.#queryClient) {
      this.#queryClient = new QueryClient({
        // queryCache: new QueryCache({
        //   onError: (res) => {
        //     toast({ title: "Error", description: res.data?.error });
        //   },
        // }),
        defaultOptions: {
          queries: {
            staleTime: settings.staleTime,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      });
    }

    return this.#queryClient;
  }

  static destroy() {
    this.#queryClient = null;
  }

  constructor() {
    throw new Error("This class cannot be instantiated");
  }
}
