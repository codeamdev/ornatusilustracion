export function formatCOP(price: number): string {
  return `$${Math.round(price).toLocaleString("es-CO")}`;
}
