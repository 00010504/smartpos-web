export default async function upload(body, token, params) {
  let res = await fetch(`${import.meta.env.VITE_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      timezone: new Date().getTimezoneOffset(),
      "Accept-Language": "ru", // hardcoded
      // "Content-Type": "multipart/form-data", // no need to set this header for FormData
    },
    body,
    params,
  });
  res = await res.json();
  return res.file_name;
}
