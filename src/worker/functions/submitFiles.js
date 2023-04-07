import upload from "./upload";

export default async function submitFiles({ files, token }) {
  let urls = [];

  if (Array.isArray(files)) {
    urls = await Promise.all(
      files?.map(async (file) => {
        if (file.serverFetched) {
          return file;
        }

        const formData = new FormData();
        const fetchedFile = await fetch(file.preview).then((res) => res.blob());
        formData.append("file", fetchedFile);
        const file_url = await upload(formData, token);
        return { name: file.name, file_url };
      }),
    );
  }

  self.postMessage({ result: urls });
}
