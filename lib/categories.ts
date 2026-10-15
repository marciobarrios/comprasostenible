export const CATEGORIES = {
  ropa: "Ropa",
  calzado: "Calzado",
  higiene: "Higiene y cosmética",
  muebles: "Muebles y decoración",
  limpieza: "Limpieza",
  peques: "Peques",
};

export function isCategory(id: string): id is keyof typeof CATEGORIES {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, id);
}
