import { upload } from "@/services";

const sendImage = async (preview) => {
  const formData = new FormData();
  const image = await fetch(preview).then((res) => res.blob());
  formData.append("file", image);
  const url = await upload(formData);
  return url;
};

export default sendImage;
