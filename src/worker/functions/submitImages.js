import upload from "./upload";

export default async function submitImages({ images, token }) {
  const urls = await Promise.all(
    images?.map(async (image) => {
      if (image.serverFetched) {
        return image.preview;
      }
      const formData = new FormData();
      const fetchedImage = await fetch(image.preview).then((res) => res.blob());
      formData.append("file", fetchedImage);
      const url = await upload(formData, token);
      return url;
    }),
  );
  self.postMessage({ result: urls });
}
