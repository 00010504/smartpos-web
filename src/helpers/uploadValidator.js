/**
 * A function that validates upload file size and type and return an error object.
 * @param {file} _file File to be validated from useDropzone
 * @param {string} uploadType Type of file [excel, image]
 * @returns {object} {code: "file-too-large", message: "File is too large"} || {code: "file-type-not-supported", message: "File type not supported"} || null
 * @see {@link src/components/molecules/Upload/FileUpload.jsx}
 */

export default function uploadValidator(_file, config) {
  const { max_size, file_type } = config;

  if (_file.size > max_size) {
    return {
      code: "file-too-large",
      message: "File is too large",
    };
  }
  if (checkFileType(_file, file_type)) {
    return {
      code: "file-type-not-supported",
      message: "File type not supported",
    };
  }
  return null;
}

const acceptedFileTypes = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

const acceptedDocTypes = ["x-pdf", "application/pdf"];

function checkFileType(file, type) {
  if (type === "excel") return !acceptedFileTypes.includes(file.type);
  if (type === "image") return !file.type.startsWith("image");
  if (type === "document") return !acceptedDocTypes.includes(file.type);
  return false;
}
