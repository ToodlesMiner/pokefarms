const formatInput = (value) => {
  const sanitizedValue = value.replace(/[^0-9.]/g, "");

  return sanitizedValue
    ? Number(sanitizedValue).toLocaleString(undefined, {
        maximumFractionDigits: 18,
      })
    : "";
};

export { formatInput };
