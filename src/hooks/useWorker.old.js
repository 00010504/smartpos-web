import SingleWorker from "@/classes/SingleWorker";

// although this file is executed only once, to avoid creating unnecessary instances of the worker, we use the singleton pattern
const worker = SingleWorker.getInstance();

export default function useWorker() {
  return worker;
}
