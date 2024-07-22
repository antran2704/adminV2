const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

export { formatDate };
