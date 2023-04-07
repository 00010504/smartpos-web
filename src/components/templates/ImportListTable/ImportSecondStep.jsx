import { useEffect, useRef, useState, useMemo } from "react";
import { Upload as TusUpload } from "tus-js-client";
import { SimpleGrid } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import UploadProgress from "@/components/organisms/UploadProgress";
import formatBytes from "@/helpers/formatBytes";
import CustomSwitch from "@/components/molecules/CustomSwitch";
import Select from "@/components/molecules/Select/Select";
import formatSeconds from "@/helpers/formatSeconds";
import { generateBarcodesOptions, styles } from "./data";

export default function ImportSecondStep({
  file: droppedFile,
  getValue,
  setValue,
  control,
  errors,
  hasUploaded,
  setHasUploaded,
}) {
  const [percentage, setPercentage] = useState(0);
  const bytesUploadedRef = useRef(null);
  const remainingTimeRef = useRef(null);
  const { t } = useTranslation();

  const upload = useMemo(() => {
    let startTime = new Date().getTime();
    let preBytesUploaded = 0;
    let bytesPortion = 0;

    return new TusUpload(droppedFile, {
      endpoint: import.meta.env.VITE_TUS_ENDPOINT,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: droppedFile.name,
        filetype: droppedFile.type,
      },
      addRequestId: true,
      onError(error) {
        console.log(`Failed because: ${error}`);
      },
      onProgress(bytesUploaded, bytesTotal) {
        bytesPortion = bytesUploaded - preBytesUploaded;
        preBytesUploaded = bytesUploaded;

        const progressTime = new Date().getTime();
        const duration = (progressTime - startTime) / 1000; // in seconds
        const speed = bytesPortion / duration;
        // if speed === 0, Infinity or NaN, then
        const remainingTime = Math.round((bytesTotal - bytesUploaded) / speed); // in seconds

        remainingTimeRef.current.textContent = formatSeconds(remainingTime);

        startTime = progressTime; // reset the start time for the next portion to get uploaded

        const calcPercentage = Math.round((bytesUploaded / bytesTotal) * 100);
        setPercentage(calcPercentage);

        bytesUploadedRef.current.textContent = `${formatBytes(
          bytesUploaded,
        )} of ${formatBytes(bytesTotal)}`;
      },
      onSuccess() {
        console.log("Download %s from %s", upload.file.name, upload.url);
        setValue("url", upload.url);
        setHasUploaded(true);
      },
    });
  }, [setValue, droppedFile, setHasUploaded]);

  useEffect(() => {
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        console.log("Previous upload found. Resuming upload...");
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });

    if (bytesUploadedRef.current) {
      bytesUploadedRef.current.textContent = "loading...";
    }

    return () => {
      upload.abort();
      console.log("upload aborted");
    };
  }, [upload]);

  return (
    <SimpleGrid gridTemplateColumns="1fr" gap="30px">
      <UploadProgress
        filename={droppedFile.name}
        hasUploaded={hasUploaded}
        bytesUploadedRef={bytesUploadedRef}
        remainingTimeRef={remainingTimeRef}
        percentage={percentage}
      />
      <CustomSwitch
        label={t("generate_barcode")}
        options={generateBarcodesOptions}
        active={getValue("generate_barcode")}
        onChange={(val) => setValue("generate_barcode", val)}
      />
      <Select
        name="type"
        label={t("type")}
        control={control}
        errors={errors}
        styles={styles.selectStyles}
        options={[
          {
            value: "entrance",
            label: "Entrance",
          },
          {
            value: "exit",
            label: "Exit",
          },
        ]}
        selectProps={{
          placeholder: t("select"),
        }}
      />
      <Select
        name="supplier"
        label={t("supplier")}
        control={control}
        errors={errors}
        styles={styles.selectStyles}
        options={[
          {
            value: "supplier1",
            label: "Supplier 1",
          },
          {
            value: "supplier2",
            label: "Supplier 2",
          },
        ]}
        selectProps={{
          placeholder: t("select"),
        }}
      />
    </SimpleGrid>
  );
}

ImportSecondStep.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
  }).isRequired,
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  hasUploaded: PropTypes.bool.isRequired,
  setHasUploaded: PropTypes.func.isRequired,
};
