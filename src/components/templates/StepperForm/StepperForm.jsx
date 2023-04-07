import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import FormStep from "@/components/organisms/FormStep/FormStep";
import Input from "@/components/molecules/Input/Input";
import Upload, { UPLOAD_TYPES } from "@/components/molecules/Upload/Upload";
import InputMask from "@/components/molecules/Input/InputMask";

let lastClickedDoc = null;

export default function StepperForm({
  currStep,
  steps,
  onSubmit,
  control,
  errors,
  docs,
  setDocs,
}) {
  const { t } = useTranslation();

  const [selectedDocIndex, setSelectedDocIndex] = useState(null);

  const dropHandler = (acceptedDocs) => {
    const newDocs = acceptedDocs.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setDocs((prev) => {
      return [...prev, ...newDocs];
    });
  };

  const docSelectHandler = (i) => {
    setSelectedDocIndex(i);
    lastClickedDoc = i;
  };

  const outsideDocClickHandler = () => {
    if (selectedDocIndex !== null) {
      setSelectedDocIndex(null);
    }
  };

  const docRemoveHandler = () => {
    if (selectedDocIndex !== null) {
      setSelectedDocIndex(null);
      setDocs((prev) => prev.filter((_, i) => i !== lastClickedDoc));
    }
  };

  const formItems = {
    Main: {
      firstCol: [
        <Input
          key="supplier_company_name"
          name="supplier_company_name"
          control={control}
          errors={errors}
          label={`${t("supplier_company_name")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("supplier_company_name"),
          }}
        />,
        <Input
          key="address"
          name="address"
          control={control}
          errors={errors}
          label={`${t("address")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("address"),
          }}
        />,
        <Input
          key="name"
          name="name"
          control={control}
          errors={errors}
          label={`${t("name")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("name"),
          }}
        />,
      ],
      secondCol: [
        <Input
          key="agreement_number"
          name="agreement_number"
          control={control}
          errors={errors}
          label={`${t("aggreement_number")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("aggreement_number"),
            type: "number",
          }}
        />,
        <Input
          key="zipcode"
          name="zipcode"
          control={control}
          errors={errors}
          label={`${t("zipcode")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("zipcode"),
          }}
        />,
        <InputMask
          key="phone_number"
          name="phone_number"
          control={control}
          errors={errors}
          label={t("phone_number")}
          inputProps={inputStyles}
          maskProps={{
            placeholder: t("enter_your_phone_number"),
            mask: "+\\9\\98\\ 99 999-99-99",
          }}
        />,
      ],
    },
    Requisites: {
      firstCol: [
        <Input
          key="supplier_company_legal_name"
          name="supplier_company_legal_name"
          control={control}
          errors={errors}
          label={`${t("supplier_company_legal_name")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("supplier_company_legal_name"),
          }}
        />,
        <Input
          key="bank_account"
          name="bank_account"
          control={control}
          errors={errors}
          label={`${t("bank_account")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("bank_account"),
          }}
        />,
        <Input
          key="legal_address"
          name="legal_address"
          control={control}
          errors={errors}
          label={`${t("legal_address")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("legal_address"),
          }}
        />,
      ],
      secondCol: [
        <Input
          key="bank_name"
          name="bank_name"
          control={control}
          errors={errors}
          label={`${t("bank_name")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("bank_name"),
          }}
        />,
        <Input
          key="tin"
          name="tin"
          control={control}
          errors={errors}
          label={`${t("tin")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("tin"),
          }}
        />,
        <Input
          key="ibt"
          name="ibt"
          control={control}
          errors={errors}
          label={`${t("ibt")}`}
          isRequired
          inputProps={{
            ...inputStyles,
            placeholder: t("ibt"),
          }}
        />,
      ],
    },
    Documents: {
      firstCol: null,
      secondCol: null,
      row: (
        <Upload
          filetype={UPLOAD_TYPES.document}
          shouldHaveMain={false}
          files={docs}
          selectedFileIndex={selectedDocIndex}
          onDrop={dropHandler}
          onSelect={docSelectHandler}
          onRemove={docRemoveHandler}
          onOutsideClick={outsideDocClickHandler}
        />
      ),
    },
  };

  return (
    <form id="supplier-form" onSubmit={onSubmit}>
      <SwipeableViews index={currStep}>
        {steps.map((step) => (
          <FormStep key={step} {...formItems[step]} />
        ))}
      </SwipeableViews>
    </form>
  );
}

const inputStyles = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};

StepperForm.propTypes = {
  currStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  docs: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  setDocs: PropTypes.func.isRequired,
};
