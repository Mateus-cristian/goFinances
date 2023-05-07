export function formatDate(date: Date) {
  const formattedDate = date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .toString();

  return formattedDate;
}
