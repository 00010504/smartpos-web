export const css = {
  productInfoGrid: {
    gridTemplateColumns: "120px auto",
    gap: "24px",
  },
  imageWrapper: {
    p: "12px",
    bg: "colors.grayF9",
    borderRadius: "20px",
    height: "120px",
    overflow: "hidden",
  },
  image: {
    borderRadius: 10,
    width: "100%",
    height: "96px",
    objectFit: "cover",
  },
  productName: {
    color: "colors.link",
    mt: "6px",
    mb: "10px",
    size: "sm",
    fontSize: "18px",
    lineHeight: 1.3,
  },
  th: {
    textTransform: "none",
    fontWeight: "500",
    height: "48px",
    fontSize: "13px",
    border: "none",
    color: "colors.headingColor",
  },
};

export const empty = null;

export function mergeBy(field_name, arr1, arr2) {
  // const field_name_validation = yup.string().trim();

  const max_iter_count = arr1.length > arr2.length ? arr1.length : arr2.length;
  let curr_iter = 0;
  const merged_arr = [];

  while (max_iter_count > curr_iter) {
    const first_entity = arr1[curr_iter];
    const search_val = first_entity[field_name];
    const equals_search_val = (entity) => entity[field_name] === search_val;

    const found_entity = arr2.find(equals_search_val) ?? {};

    const merged = { ...first_entity, ...found_entity };
    merged_arr.push(merged);

    curr_iter += 1;
  }

  return merged_arr;
}
