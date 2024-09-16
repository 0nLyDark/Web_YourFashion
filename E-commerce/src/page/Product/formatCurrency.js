export const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // VND thường không cần chữ số thập phân
    maximumFractionDigits: 0,
  }).format(amount);
};
