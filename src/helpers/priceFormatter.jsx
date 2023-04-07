function priceFormatter(price) {
  return (price || 0)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default priceFormatter;
