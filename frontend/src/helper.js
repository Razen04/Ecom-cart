// This function formats the price from paisa
const formatPrice = (priceInPaisa) => {
  const priceInRs = priceInPaisa / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(priceInRs);
};

export default formatPrice;