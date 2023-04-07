import LocalStorage from "@/utils/LocalStorage";

export default function prepareLSForProduction() {
  if (LocalStorage.deploy_id !== import.meta.env.VITE_DEPLOY_ID) {
    LocalStorage.set("deploy_id", import.meta.env.VITE_DEPLOY_ID);
    LocalStorage.remove(["products_table"]);
  }
}
